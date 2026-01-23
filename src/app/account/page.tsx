import { Header } from '@/components/Header'
import Footer from '@/containers/Footer'
import LoginForm from '@/components/LoginForm'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { signOut } from '@/app/account/actions'
import { Button } from '@/components/ui'
import { tracks } from '@/utils/musicTracks'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Особистий кабінет',
}

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <main className="flex-grow flex items-center justify-center px-6 py-24 pt-32">
          <LoginForm />
        </main>
        <Footer />
      </div>
    )
  }

  await dbConnect()
  const user = await User.findOne({ email: session.email })
  
  // Map purchased track IDs to actual track objects
  // Assuming user.orders contains objects with trackId
  const purchasedTracks = user?.orders?.map((order: any) => {
    return tracks.find(t => t.trackId === order.trackId)
  }).filter(Boolean) || []

  // Remove duplicates if any
  const uniqueTracks = Array.from(new Set(purchasedTracks.map((t: any) => t.trackId)))
    .map(id => purchasedTracks.find((t: any) => t.trackId === id))

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex-grow py-24 px-6 pt-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Особистий кабінет</h1>
            <form action={signOut}>
              <Button type="submit">Вийти</Button>
            </form>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Мої дані</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Email: <span className="text-zinc-900 dark:text-zinc-100 font-medium">{user?.email}</span></p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Мої покупки</h2>
            {uniqueTracks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {uniqueTracks.map((track: any) => (
                  <div key={track.trackId} className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <div className="relative aspect-square">
                      <Image src={track.coverSrc} alt={track.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-2">{track.title}</h3>
                      <audio controls className="w-full h-8" src={`/api/audio/${track.trackId}.mp3`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
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