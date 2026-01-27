import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Download } from 'lucide-react'
import LoginForm from '@/components/LoginForm'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import '@/models/Order' // Ensure Order model is registered
import { signOut } from '@/app/account/actions'
import { Button } from '@/components/ui'
import { tracks } from '@/utils/musicTracks'
import { Order, MusicTrack } from '@/types'

export const metadata = {
  title: 'Особистий кабінет',
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center px-6 py-24 pt-32">
          <LoginForm />
        </main>
        <Footer />
      </div>
    )
  }

  await dbConnect()
  const user = await User.findOne({ email: session.email }).populate('orders').lean()
  
  // Map purchased track IDs to actual track objects
  const purchasedTrackIds = new Set<string>()
  const videoGreetings: Order[] = []

  user?.orders?.forEach((order: Order) => {
    if (order.productType === 'music_track' && order.productData?.trackIds) {
      order.productData.trackIds.forEach((id: string) => purchasedTrackIds.add(id))
    } else if (order.productType === 'video_greeting') {
      videoGreetings.push(order)
    }
  })

  videoGreetings.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  const uniqueTracks: MusicTrack[] = Array.from(purchasedTrackIds)
    .map(id => tracks.find(t => t.trackId === id))
    .filter((track): track is MusicTrack => Boolean(track))
    
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans" style={{ backgroundColor: "var(--background)" }}>
      <Header />
      <main className="flex-grow py-24 px-6 pt-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Особистий кабінет</h1>
            <form action={signOut}>
              <Button type="submit">Вийти</Button>
            </form>
          </div>

          <div className="p-6 rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
            <h2 className="text-xl font-semibold mb-4">Мої дані</h2>
            <p className="text-zinc-600">Email: <span className="text-zinc-900 font-medium">{user?.email}</span></p>
          </div>

          {videoGreetings.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Мої відеопривітання</h2>
              <div className="grid grid-cols-1 gap-6">
                {videoGreetings.map((order: Order) => (
                  <div key={order.reference} className="p-6 rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-grow">
                        <div className="border-b border-zinc-100 pb-4">
                          <h3 className="text-sm font-semibold">Замовлення #{order.reference}</h3>
                          <p className="text-sm text-zinc-500">
                            {new Date(order.orderDate).toLocaleDateString('uk-UA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                          <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Ім&apos;я дитини</p>
                            <p className="font-medium text-base">{order.productData?.childName}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Пестливе ім&apos;я</p>
                            <p className="font-medium text-base">{order.productData?.childNameCute}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Вік</p>
                            <p className="font-medium text-base">{order.productData?.age} років</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Дата народження</p>
                            <p className="font-medium text-base">{order.productData?.birthday}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Telegram</p>
                            <p className="font-medium text-base">{order.contacts?.telegram || '-'}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">Сума</p>
                            <p className="font-medium text-base">{order.amount} {order.currency}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center items-center rounded-lg p-6 min-w-[200px] text-center" style={{ backgroundColor: "var(--secondary)" }}>
                         <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                         </div>
                         <span className="text-sm font-semibold text-green-700 mb-2">
                           Оплачено успішно
                         </span>
                         <p className="text-xs text-zinc-500">
                            Якщо Ви ще не отримали Ваше відеопривітання то Ви отримаєте його на вказану поштову адресу у встановлений термін.
                         </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Мої покупки</h2>
            {uniqueTracks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uniqueTracks.map((track) => (
                  <div key={track.trackId} className="rounded-xl overflow-hidden shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
                    <div className="relative aspect-square">
                      <Image src={track.coverSrc} alt={track.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{track.title}</h3>
                      <audio controls className="w-full h-8" src={`/api/audio/${track.trackId}.mp3`} />
                      <a
                        href={`/api/audio/download/${track.trackId}.mp3`}
                        download
                        style={{ backgroundColor: "var(--accent)" }}
                        className="flex items-center justify-center w-full mt-3 py-2 text-sm font-medium text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Завантажити
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
                <p className="text-zinc-500">У вас поки немає придбаних треків</p>
                <Button className="mt-4">
                  <Link href="/my-songs">Перейти до каталогу</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}