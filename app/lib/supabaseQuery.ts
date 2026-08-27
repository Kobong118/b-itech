import { supabase } from './supabaseClient';
import { Database } from '@/types/database.types';
import { formatCurrency } from './utils'; // Menggunakan formatCurrency bawaan project

export type TableName = keyof Database['public']['Tables'];
export type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

interface DynamicQueryOptions<T extends TableName> {
  table: T;
  select?: string;
  filters?: Partial<TableRow<T>>;
  page?: number;     // Halaman ke berapa (dimulai dari 1)
  pageSize?: number; // Jumlah data per halaman (misal: 10, 20, 50)
}

export async function fetchDynamicData<T extends TableName>({
  table,
  select = '*',
  filters,
  page,
  pageSize = 10, // Default 10 data per halaman jika page diisi
}: DynamicQueryOptions<T>) {
  // Tambahkan count: 'exact' untuk mendapatkan total seluruh baris data di database
  let query = supabase.from(table).select(select, { count: 'exact' });

  // 1. Terapkan Pagination jika parameter 'page' diberikan
  if (page !== undefined && page > 0) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  // 2. Terapkan Filters jika ada
  if (filters) {
    type FilterColumn = Parameters<typeof query.eq>[0];
    const keys = Object.keys(filters) as FilterColumn[];

    for (const key of keys) {
      const value = filters[key as keyof typeof filters];
      if (value !== undefined && value !== null) {
        query = query.eq(key, value as any);
      }
    }
  }

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  // Kembalikan data beserta metadata pagination
  return {
    data,
    meta: {
      totalData: count ?? 0,
      currentPage: page ?? 1,
      pageSize: page !== undefined ? pageSize : (count ?? 0),
      totalPages: page !== undefined && count ? Math.ceil(count / pageSize) : 1,
    },
  };
}


export async function getMonthlyTabungan() {
  // Tanpa 'as any' — Supabase otomatis mengenali tabel 'ctt_tabungan' & kolom-kolomnya
  const { data, error } = await supabase
    .from('ctt_tabungan')
    .select('setor_tunai, setor_e_walet, tanggal');

  if (error) {
    throw error;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthlyTotals: Record<string, number> = {};
  months.forEach((m) => (monthlyTotals[m] = 0));

  data?.forEach((row) => {
    if (row.tanggal) {
      const date = new Date(row.tanggal);
      const monthName = months[date.getMonth()];

      // Mengambil dan menjumlahkan nilai secara aman
      const nominal = Number(row.setor_tunai || 0) + Number(row.setor_e_walet || 0);
      monthlyTotals[monthName] += nominal;
    }
  });

  return months.map((month) => ({
    month,
    total: monthlyTotals[month],
  }));
}


export async function fetchLatestTabungan() {
  try {
    const { data, error } = await supabase
      .from('ctt_tabungan')
      .select(`
        id,
        id_name,
        setor_tunai,
        setor_e_walet,
        update_at,
        data_jamaah (
          nama,
          no_rek
        )
      `)
      .order('update_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Supabase Query Error:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((item: any) => {
      const totalSetor = Number(item.setor_tunai || 0) + Number(item.setor_e_walet || 0);

      // Handle jika data_jamaah dikembalikan sebagai Object maupun Array
      const jamaahObj = Array.isArray(item.data_jamaah) 
        ? item.data_jamaah[0] 
        : item.data_jamaah;

      return {
        id: item.id,
        id_name: item.id_name,
        nama: jamaahObj?.nama || 'Tanpa Nama',
        rek: jamaahObj?.no_rek || '-',
        amount: formatCurrency(totalSetor),
        date: item.update_at,
      };
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest tabungan data.');
  }
}

export async function fetchCardData() {
  try {
    // 1. Inisialisasi query paralel tanpa menggunakan await secara langsung

    // A. Jumlah total nasabah/jamaah
    const jamaahCountPromise = supabase
      .from('data_jamaah')
      .select('*', { count: 'exact', head: true });

    // B. Jumlah penabung aktif (jamaah unik yang pernah menabung)
    const activePenabungPromise = supabase
      .from('ctt_tabungan')
      .select('id_name');

    // C. Ambil seluruh data setor_tunai dan setor_e_walet untuk akumulasi debit/credit
    // (Asumsi: Setor Tunai = Credit/Cash, Setor E-Wallet = Debit/Digital)
    const tabunganTotalsPromise = supabase
      .from('ctt_tabungan')
      .select('setor_tunai, setor_e_walet, tarik_tunai, tarik_e_walet');

    // 2. Jalankan semua promise secara bersamaan demi performa maksimal
    const [jamaahRes, penabungRes, tabunganRes] = await Promise.all([
      jamaahCountPromise,
      activePenabungPromise,
      tabunganTotalsPromise,
    ]);

    // Handle error jika salah satu query gagal
    if (jamaahRes.error) throw jamaahRes.error;
    if (penabungRes.error) throw penabungRes.error;
    if (tabunganRes.error) throw tabunganRes.error;

    // 3. Olah & kalkulasi data dari response

    // Total Jamaah/Nasabah
    const numberOfJamaah = jamaahRes.count ?? 0;

    // Jumlah Penabung Aktif (dihitung berdasarkan id_name yang unik)
    const uniquePenabung = new Set(penabungRes.data?.map((item) => item.id_name));
    const numberOfActivePenabung = uniquePenabung.size;

    // Akumulasi Total Tabungan (Debit & Credit)
    let totalSetorTunaiRaw = 0; // Setor Tunai
    let totalSetorEwaletRaw = 0;  // Setor E-Wallet

    tabunganRes.data?.forEach((row) => {
      totalSetorTunaiRaw += Number(row.setor_tunai || 0);
      totalSetorEwaletRaw += Number(row.setor_e_walet || 0);
    });

    // akumulasi total tarik tunai dan e-wallet dari seluruh data tabungan
    let totalTarikTunaiRaw = 0;
    let totalTarikEWalletRaw = 0;

    tabunganRes.data?.forEach((row) => {
      totalTarikTunaiRaw += Number(row.tarik_tunai || 0);
      totalTarikEWalletRaw += Number(row.tarik_e_walet || 0);
    });

    const totalUangTunai = formatCurrency(totalSetorTunaiRaw - totalTarikTunaiRaw);
    const totalEwalet = formatCurrency(totalSetorEwaletRaw - totalTarikEWalletRaw);

    return {
      numberOfJamaah,
      numberOfActivePenabung,
      totalUangTunai,
      totalEwalet,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6; // sesuaikan jumlah item per halaman

export async function fetchFilteredTabungan(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let supabaseQuery = supabase
      .from('ctt_tabungan')
      .select(`
        id,
        id_name,
        setor_tunai,
        setor_e_walet,
        tarik_tunai,
        tarik_e_walet,
        keterangan,
        ket_e_walet,
        update_at,
        update_by,
        data_jamaah!inner (
          nama,
          kontak,
          jenis_kelamin
        )
      `);

    // Filter Pencarian Langsung berdasarkan Nama Jamaah
    if (query) {
      supabaseQuery = supabaseQuery.ilike('data_jamaah.nama', `%${query}%`);
    }

    const { data, error } = await supabaseQuery
      .order('update_at', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (error) {
      console.error('Supabase Query Error Detail:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((item: any) => {
      const jamaahObj = Array.isArray(item.data_jamaah)
        ? item.data_jamaah[0]
        : item.data_jamaah;

      return {
        id: item.id,
        id_name: item.id_name,
        nama: jamaahObj?.nama || item.id_name || 'Tanpa Nama',
        kontak: jamaahObj?.kontak || '-',
        jenis_kelamin: jamaahObj?.jenis_kelamin || '',
        setor_tunai: item.setor_tunai,
        setor_e_walet: item.setor_e_walet,
        tarik_tunai: item.tarik_tunai,
        tarik_e_walet: item.tarik_e_walet,
        keterangan: item.keterangan,
        ket_e_walet: item.ket_e_walet,
        update_at: item.update_at,
        update_by: item.update_by,
      };
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tabungan data.');
  }
}

export async function fetchTabunganPages(query: string) {
  try {
    let supabaseQuery = supabase
      .from('ctt_tabungan')
      .select('id, data_jamaah!inner(nama)', { count: 'exact', head: true });

    // Filter Pencarian Halaman Langsung berdasarkan Nama Jamaah
    if (query) {
      supabaseQuery = supabaseQuery.ilike('data_jamaah.nama', `%${query}%`);
    }

    const { count, error } = await supabaseQuery;

    if (error) {
      console.error('Supabase Count Error Detail:', error);
      throw error;
    }

    return Math.ceil(Number(count ?? 0) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of tabungan pages.');
  }
}