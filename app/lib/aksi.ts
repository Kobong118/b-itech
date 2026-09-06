'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { checkNamaExists, insertNewJamaah } from './supabaseQuery';
import { signOut } from '@/auth';
 
// ...
 
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

export async function daftarJamaah(formData:{nama: string, kontak: number, jenis_kelamin: string, pin?: number}) {
  const namaClean = formData.nama.trim();
    const kontakClean = formData.kontak.toString().trim();
    const pinClean = Number(formData.pin ?? 0);

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
      jenis_kelamin: formData.jenis_kelamin,
      pin: pinClean,
    });
    return insertResult;
}

export async function authenticateMobile(
  prevState: string | undefined,
  formData: FormData,
) {
  const identitas = formData.get('identitas')?.toString().trim();
  const pin = formData.get('pin')?.toString().trim(); // Ambil 'pin' bukan 'password'
  const redirectTo = formData.get('redirectTo')?.toString() || '/mobile';

  console.log('Identitas:', identitas);
  console.log('PIN:', pin);

  if (!identitas || !pin) {
    return 'No. WhatsApp / Nama dan PIN wajib diisi.';
  }

  try {
    await signIn('jamaah-credentials', {
      identitas,
      pin,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'No. WhatsApp / Nama atau PIN salah.';
        default:
          return 'Terjadi kesalahan saat masuk.';
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/' });
}