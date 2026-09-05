import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
  try {
    const { input_identitas } = await request.json(); // Bisa No WA atau Nama

    if (!input_identitas) {
      return NextResponse.json(
        { success: false, message: 'Nomor WhatsApp / Nama wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanInput = input_identitas.trim();

    // Cari berdasarkan kontak (No WA) ATAU nama di tabel data_jamaah
    const { data: jamaah, error } = await supabase
      .from('data_jamaah')
      .select('id, nama, kontak')
      .or(`kontak.eq.${cleanInput},nama.ilike.%${cleanInput}%`)
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!jamaah) {
      return NextResponse.json(
        { 
          success: false, 
          is_registered: false,
          message: 'Data jamaah tidak ditemukan. Silakan lakukan pendaftaran.' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      is_registered: true,
      message: 'Login berhasil!',
      jamaah: {
        id: jamaah.id,
        nama: jamaah.nama,
        kontak: jamaah.kontak,
      },
    });
  } catch (err) {
    console.error('Error login-simple:', err);
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat login.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}