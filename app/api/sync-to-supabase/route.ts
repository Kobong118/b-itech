import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface DynamicSyncPayload {
  target_table: string;
  data: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Konfigurasi .env.local belum lengkap." }, { status: 500 });
    }

    // 1. Ambil teks mentah terlebih dahulu untuk validasi keamanan
    const textData = await request.text();
    if (!textData) {
      return NextResponse.json({ error: 'Body request kosong!' }, { status: 400 });
    }

    // 2. DEKLARASI BODY (Cukup satu kali ini saja di seluruh fungsi)
    const body: DynamicSyncPayload = JSON.parse(textData);
    const { target_table, data } = body;

    // 3. Validasi isi payload
    if (!target_table || !data || !data.id) {
      return NextResponse.json({ error: 'Payload JSON tidak lengkap (Butuh target_table dan data.id)' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. AMBIL TIMESTAMP DATA LAMA DI SUPABASE (CARA BARU YANG AMAN UNTUK TABEL KOSONG)
    const { data: existingRows, error: fetchError } = await supabase
      .from(target_table)
      .select('updated_at')
      .eq('id', data.id); // Kita hapus .single() agar tidak crash jika data kosong

    // Cek jika ada data lama yang ditemukan di database
    if (existingRows && existingRows.length > 0) {
      const existingData = existingRows[0]; // Ambil baris pertama

      if (existingData?.updated_at && data.updated_at) {
        const timeExisting = new Date(existingData.updated_at).getTime();
        const timeIncoming = new Date(data.updated_at).getTime();

        // Jika data di database sudah lebih baru, batalkan proses masuknya data sheet
        if (timeExisting >= timeIncoming) {
          return NextResponse.json({ message: `Data di tabel '${target_table}' sudah lebih baru.` }, { status: 200 });
        }
      }
    }


    // 5. UPSERT DATA DINAMIS
    const { error } = await supabase
      .from(target_table)
      .upsert(data, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Tabel '${target_table}' berhasil diperbarui.`
    });
  } catch (error: any) {
    console.error('Error Sync:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
