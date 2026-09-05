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

export async function getJamaahByIdentitas(identitas: string) {
    try {
        const cleanInput = identitas.trim();
        const { data, error } = await supabase
            .from('data_jamaah')
            .select('*')
            .or(`nama.ilike.%${cleanInput}%`)
            .limit(1)
            .maybeSingle();

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

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        nama_pengguna: z.string(),
                        kata_sandi: z.string().min(6)
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                if (parsedCredentials.success) {
                    const { nama_pengguna, kata_sandi } = parsedCredentials.data;
                    // Cari panitia berdasarkan nama pengguna
                    const panitia = await getPanitiaByNamaPengguna(nama_pengguna);
                    if (!panitia) {
                        return null;
                    }
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
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ identitas: z.string() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { identitas } = parsedCredentials.data;

                    const jamaah = await getJamaahByIdentitas(identitas);

                    if (jamaah) {
                        return {
                            id: String(jamaah.id),
                            name: jamaah.nama,
                            // Ubah number/null menjadi string agar sesuai skema NextAuth User
                            email: jamaah.kontak ? String(jamaah.kontak) : null,
                            role: 'jamaah',
                        };
                    }
                }

                return null;
            },
        }),
    ],
});