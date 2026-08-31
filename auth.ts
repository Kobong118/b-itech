import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { Panitia, User } from '@/app/lib/definitions';
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

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log('Credentials diterima:', credentials);
                const parsedCredentials = z
                    .object({
                        nama_pengguna: z.string(),
                        kata_sandi: z.string().min(6)
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.log('Zod validation failed:', parsedCredentials.error.format());
                    return null;
                }

                if (parsedCredentials.success) {
                    const { nama_pengguna, kata_sandi } = parsedCredentials.data;
                    console.log(nama_pengguna, kata_sandi);
                    // Cari panitia berdasarkan nama pengguna
                    const panitia = await getPanitiaByNamaPengguna(nama_pengguna);
                    if (!panitia) {
                        console.log('Panitia tidak ditemukan');
                        return null;
                    }

                    console.log('Data Panitia dari DB:', panitia);
                    console.log('Kata Sandi Input vs DB:', kata_sandi, panitia.kata_sandi);
                    // Bandingkan kata sandi
                    const passwordsMatch = await bcrypt.compare(kata_sandi, panitia.kata_sandi);

                    if (passwordsMatch) {
                        // Mengembalikan objek user dengan `id` bertipe string
                        return {
                            ...panitia,
                            id: String(panitia.id),
                        };
                    }
                }
                console.log('Invalid credentials');
                return null;
            },
        }),],
});