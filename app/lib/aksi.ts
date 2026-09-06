'use server';
 
import { signIn } from '@/auth';
import { AuthError, CredentialsSignin } from 'next-auth';
import { signOut } from '@/auth';
import {
  syncJamaahFcmToken,
  checkNamaExists,
  insertNewJamaah,
  getJamaahIdByIdentitas,
} from '@/app/lib/supabaseQuery';
import { redirect } from 'next/navigation';
 
export type ActionState = {
  message?: string;
  success?: boolean;
};

// 1. Action Login
export async function authenticateMobile(
  prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState | undefined> {
  const identitasVal = formData.get('identitas')?.toString();
  const fcmToken = formData.get('fcmToken')?.toString();

  if (!identitasVal) {
    return { message: 'Nomor WhatsApp / Rekening wajib diisi.' };
  }

  // Sync FCM Token jika token tersedia
  if (fcmToken) {
    try {
      const jamaahId = await getJamaahIdByIdentitas(identitasVal);
      if (jamaahId) {
        await syncJamaahFcmToken(fcmToken, jamaahId);
      }
    } catch (err) {
      console.error('Error sync FCM token:', err);
    }
  }

  try {
    const data = Object.fromEntries(formData);
    await signIn('jamaah-credentials', {
      ...data,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { message: 'Data jamaah tidak ditemukan. Silakan periksa kembali.' };
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Data jamaah tidak ditemukan. Silakan periksa kembali.' };
        default:
          return { message: 'Terjadi kesalahan saat masuk.' };
      }
    }
    throw error;
  }

  // Redirect jika login berhasil
  const callbackUrl = formData.get('redirectTo')?.toString() || '/mobile';
  redirect(callbackUrl);
}

// 2. Action Registrasi
export async function registerJamaahMobile(
  prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState | undefined> {
  const nama = formData.get('nama')?.toString()?.trim() || '';
  const kontakStr = formData.get('kontak')?.toString()?.trim() || '';
  const jenisKelamin = formData.get('jenis_kelamin')?.toString() || 'Laki-laki';
  const fcmToken = formData.get('fcmToken')?.toString();

  // Validasi Server Side
  if (!nama) {
    return { message: 'Nama lengkap wajib diisi.' };
  }

  const kontakNum = Number(kontakStr);
  if (!kontakStr || isNaN(kontakNum)) {
    return { message: 'Nomor WhatsApp harus berupa angka valid.' };
  }
  let isSuccess = false;
  try {
    // Cek keberadaan nama di Supabase
    const isExist = await checkNamaExists(nama);
    if (isExist) {
      return { message: 'Nama ini sudah terdaftar. Silakan gunakan nama lain atau login.' };
    }

    // Insert jamaah baru
    const res = await insertNewJamaah({
      nama,
      kontak: kontakNum,
      jenis_kelamin: jenisKelamin,
    });

    if (res.success && res.jamaah) {
      if (res.jamaah.id && fcmToken) {
        await syncJamaahFcmToken(fcmToken, Number(res.jamaah.id));
      }
      isSuccess = true;
    } else {
      return { message: res.message || 'Gagal merespons pendaftaran.' };
    }
  } catch (err) {
    console.error('Error register:', err);
    return { message: 'Gagal memproses pendaftaran jamaah baru.' };
  }

  // PROSES AUTOMATIC LOGIN & REDIRECT (DI LUAR TRY-CATCH REGISTER)
  try {
    await signIn('jamaah-credentials', {
      identitas: kontakNum,
      redirect: false, // Penting agar signIn tidak melempar NEXT_REDIRECT
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: 'Pendaftaran berhasil, tetapi gagal login otomatis. Silakan login manual.' };
    }
    throw error;
  }

  // Redirect setelah pendaftaran sukses
 if (isSuccess) {
    redirect('/mobile');
  }
}
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('panitia-credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function daftarJamaah(formData:{nama: string, kontak: number, jenis_kelamin: string}) {
  const namaClean = formData.nama.trim();
    const kontakClean = formData.kontak.toString().trim();

    if (!namaClean || !kontakClean) {
      return { success: false, message: 'Nama dan Nomor WA wajib diisi.' };
    }

    if (kontakClean.length < 10 || kontakClean.length > 15) {
      return { success: false, message: 'Nomor WA tidak valid' };
    }

    // Cek apakah nama sudah ada
    const namaExists = await checkNamaExists(namaClean);
    if (namaExists) {
      return { success: false, message: 'Nama sudah terdaftar.' };
    }
    // Jika nama belum ada, masukkan data baru
    const insertResult = await insertNewJamaah({
      nama: namaClean,
      kontak: parseInt(kontakClean),
      jenis_kelamin: formData.jenis_kelamin
    });
    return insertResult;
}
export type StateAuthMobile = {
  noRek?: number;
  message?: string; // Tambahkan properti ini untuk menampung pesan error
};

export async function handleSignOut(redirectTo: string = '/') {
  await signOut({ redirectTo });
}