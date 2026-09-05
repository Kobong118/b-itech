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

export async function authenticateMobile(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('jamaah-credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Data jamaah tidak ditemukan. Silakan periksa kembali.';
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