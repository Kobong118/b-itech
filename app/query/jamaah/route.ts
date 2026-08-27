import { fetchDynamicData } from '@/app/lib/supabaseQuery';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Ambil parameter page dan pageSize dari URL (contoh: /query/jamaah?page=2&pageSize=10)
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');

    const page = pageParam ? parseInt(pageParam, 10) : undefined;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

    const result = await fetchDynamicData({
      table: 'data_jamaah',
      select: 'nama',
      page,
      pageSize,
    });

    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}