import InvitationClient from '@/app/undangan/komponen/invitationClient'
import { getComments, addGuestbookEntry, addHadiahConfirmation,getGiftConfirmations } from '@/app/lib/supabaseQuery'


interface PageProps {
  searchParams: Promise<{ to?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  // Unwrapping searchParams menggunakan await
  const resolvedParams = await searchParams
  const guestName = resolvedParams?.to ? decodeURIComponent(resolvedParams.to) : 'Tamu Undangan'
  
  const comments = await getComments()
  // Ambil data konfirmasi hadiah menggunakan fungsi server yang sudah dipisah
const giftsData = await getGiftConfirmations();

  return (
    <main className="min-h-screen bg-[#EAEAEA]">
      <InvitationClient 
        guestName={guestName} 
        initialComments={comments.map((comment) => ({
          ...comment,
          name: comment.name ?? 'Anonim',
          status: comment.status ?? 'pending',
        }))} 
        addGuestbookEntry={addGuestbookEntry} 
        addHadiahConfirmation={addHadiahConfirmation}
        initialGifts={giftsData || []}
      />
    </main>
  )
}