'use server';

import { revalidatePath } from 'next/cache';
// import supabase client Anda di sini, misal: import { supabase } from '@/lib/supabase';
import { supabase } from '@/lib/supabaseClient';

// 1. Fungsi untuk Verifikasi Donatur (Menambahkan nomor transaksi unik)
export async function verifyDonatur(id: string, nomorTransaksi: string) {
    try {
        if (!nomorTransaksi || nomorTransaksi.trim() === '') {
            throw new Error('Nomor transaksi (SN) wajib diisi untuk verifikasi!');
        }

        // Ambil data donatur saat ini terlebih dahulu untuk memastikan data ada
        const { data: currentData, error: fetchError } = await supabase
            .from('donatur')
            .select('nama')
            .eq('id', id)
            .single();

        if (fetchError || !currentData) {
            throw new Error('Data donatur tidak ditemukan.');
        }

        // Bersihkan label lama jika sebelumnya sempat berstatus FAKE atau sudah terverifikasi ganda
        let cleanName = currentData.nama || ''
            .replace(/\[Terbukti FAKE\]/g, '')
            .replace(/\[Terverifikasi :.*?\]/g, '')
            .trim();

        // Format string baru sesuai permintaan admin
        const updatedName = `${cleanName} [Terverifikasi :${nomorTransaksi.trim()}]`;

        // Update ke database Supabase
        const { error: updateError } = await supabase
            .from('donatur')
            .update({ nama: updatedName })
            .eq('id', id);

        if (updateError) {
            throw new Error(updateError.message);
        }

        // Revalidate path halaman admin / daftar donatur agar langsung ter-refresh
        revalidatePath('/admin/donatur');
        revalidatePath('/undangan/maulid-1448'); // Refresh juga halaman undangan jika daftar donatur ditampilkan publik

        return { success: true, message: 'Donatur berhasil diverifikasi!' };
    } catch (err: any) {
        console.error('Error verifying donatur:', err);
        return { success: false, message: err.message || 'Gagal memverifikasi donatur.' };
    }
}

// 2. Fungsi untuk Menandai Donatur sebagai Spam / FAKE
export async function markAsFakeDonatur(id: string) {
    try {
        const { data: currentData, error: fetchError } = await supabase
            .from('donatur')
            .select('nama')
            .eq('id', id)
            .single();

        if (fetchError || !currentData) {
            throw new Error('Data donatur tidak ditemukan.');
        }

        let cleanName = currentData.nama ||  ''
            .replace(/\[Terbukti FAKE\]/g, '')
            .replace(/\[Terverifikasi :.*?\]/g, '')
            .trim();

        const updatedName = `${cleanName} [Terbukti FAKE]`;

        const { error: updateError } = await supabase
            .from('donatur')
            .update({ nama: updatedName })
            .eq('id', id);

        if (updateError) {
            throw new Error(updateError.message);
        }

        revalidatePath('/admin/donatur');
        revalidatePath('/undangan/maulid-1448');

        return { success: true, message: 'Donatur ditandai sebagai FAKE/Spam.' };
    } catch (err: any) {
        console.error('Error marking fake donatur:', err);
        return { success: false, message: err.message || 'Gagal mengubah status donatur.' };
    }
}