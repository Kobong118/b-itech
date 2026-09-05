import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { Panitia } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { supabase } from '@/app/lib/supabaseClient';

export async function getPanitiaByNamaPengguna(nama_pengguna: string): Promise<Panitia | undefined> {
  try {
    const { data, error } = await supabase
      .from('panitia')
      .select('*')
      .eq('nama_pengguna', nama_pengguna)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch panitia:', error);
      throw error;
    }

    return data as Panitia | undefined;
  } catch (error) {
    console.error('Failed to fetch panitia:', error);
    throw new Error('Failed to fetch panitia data.');
  }
}

export async function getJamaahByIdentitas(identitas: string) {
  try {
    const cleanInput = identitas.trim();
    if (!cleanInput) return null;

    const isNumeric = /^\d+$/.test(cleanInput);
    let query = supabase.from('data_jamaah').select('*');

    if (isNumeric) {
      query = query.eq('kontak', Number(cleanInput));
    } else {
      query = query.ilike('nama', `%${cleanInput}%`);
    }

    // Gunakan limit(1) agar tidak crash jika terdapat nama ganda
    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      console.error('Failed to fetch jamaah:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching jamaah data:', error);
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // 1. Provider Login Panitia (Web)
    Credentials({
      id: 'panitia-credentials',
      name: 'Panitia Credentials',
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            nama_pengguna: z.string(),
            kata_sandi: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { nama_pengguna, kata_sandi } = parsedCredentials.data;
        const panitia = await getPanitiaByNamaPengguna(nama_pengguna);
        if (!panitia) return null;

        const passwordsMatch = await bcrypt.compare(kata_sandi, panitia.kata_sandi);
        if (passwordsMatch) {
          return {
            ...panitia,
            id: String(panitia.id),
          };
        }

        return null;
      },
    }),

    // 2. Provider Login Jamaah (Mobile)
    Credentials({
      id: 'jamaah-credentials',
      name: 'Jamaah Credentials',
      async authorize(credentials) {
        const identitas = credentials?.identitas as string;
        if (!identitas) return null;

        const user = await getJamaahByIdentitas(identitas);
        if (!user) return null;

        return {
          id: String(user.id),
          name: user.nama,
        };
      },
    }),
  ],
});