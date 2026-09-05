import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured.');
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

export async function POST(request: Request) {
  try {
    const { nama, kontak } = await request.json();

    if (!nama || !kontak) {
      return NextResponse.json(
        { success: false, message: 'Nama dan Nomor WhatsApp wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanNama = nama.trim();
    const cleanKontak = kontak.trim();

    // 1. Cek apakah nomor WA sudah pernah dipakai
    const { data: existing } = await supabase
      .from('data_jamaah')
      .select('id')
      .eq('kontak', cleanKontak)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Nomor WhatsApp ini sudah terdaftar. Silakan login langsung.' },
        { status: 400 }
      );
    }

    // 2. Tambahkan Jamaah Baru ke tabel data_jamaah (saldo tabungan awal = 0)
    const { data: newJamaah, error: insertError } = await supabase
      .from('data_jamaah')
      .insert({
        nama: cleanNama,
        kontak: cleanKontak,
        jumlah_tabungan: 0, // Inisialisasi awal saldo tabungan
      })
      .select('id, nama, kontak')
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran jamaah berhasil!',
      jamaah: newJamaah,
    });
  } catch (err: unknown) {
    console.error('Error register-jamaah:', err);

    const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server.';

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}