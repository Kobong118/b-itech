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

    const textData = await request.text();
    if (!textData) {
      return NextResponse.json({ error: 'Body request kosong!' }, { status: 400 });
    }

    const body: DynamicSyncPayload = JSON.parse(textData);
    const { target_table, data } = body;

    if (!target_table || !data || !data.id) {
      return NextResponse.json({ error: 'Payload JSON tidak lengkap' }, { status: 400 });
    }

    // ========================================================
    // 🔥 PEMBERSIH DINAMIS: UBAH STRING KOSONG "" MENJADI null
    // ========================================================
    const sanitizedData: Record<string, any> = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        
        // Jika nilainya adalah string kosong, ubah menjadi null agar aman di kolom tipe numeric/date Supabase
        if (value === "") {
          sanitizedData[key] = null;
        } else {
          sanitizedData[key] = value;
        }
      }
    }
    // ========================================================

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. AMBIL TIMESTAMP DATA LAMA DI SUPABASE
    const { data: existingRows } = await supabase
      .from(target_table)
      .select('updated_at')
      .eq('id', sanitizedData.id);

    if (existingRows && existingRows.length > 0) {
      const existingData = existingRows[0];
      if (existingData?.updated_at && sanitizedData.updated_at) {
        const timeExisting = new Date(existingData.updated_at).getTime();
        const timeIncoming = new Date(sanitizedData.updated_at).getTime();

        if (timeExisting >= timeIncoming) {
          return NextResponse.json({ message: `Data di tabel '${target_table}' sudah lebih baru.` }, { status: 200 });
        }
      }
    }

    // 2. UPSERT DATA YANG SUDAH DIBERSIHKAN (sanitizedData)
    const { error } = await supabase
      .from(target_table)
      .upsert(sanitizedData, { onConflict: 'id' });

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
