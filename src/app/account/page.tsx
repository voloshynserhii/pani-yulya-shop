import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginForm from '@/components/LoginForm'
import { getSession } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import '@/models/Order' // Ensure Order model is registered
import { signOut } from '@/app/account/actions'
import { Button } from '@/components/ui'
import { tracks } from '@/utils/musicTracks'
import UserInfo from '@/components/UserInfo'
import VideoGreetingsList from '@/components/VideoGreetingsList'
import PhysicalOrdersList from '@/components/PhysicalOrdersList'
import PurchasedTracksList from '@/components/PurchasedTracksList'
import { Order, MusicTrack } from '@/types'

export const metadata = {
  title: 'Особистий кабінет',
  description: 'Переглядайте ваші замовлення та керуйте особистими даними в особистому кабінеті.'
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

  const purchasedTrackIds = new Set<string>()
  const videoGreetings: Order[] = []
  const physicalOrders: Order[] = []

  user?.orders?.forEach((order: Order) => {
    if (order.productType === 'music_track' && order.productData?.trackIds) {
      order.productData.trackIds.forEach((id: string) => purchasedTrackIds.add(id))
    } else if (order.productType === 'video_greeting') {
      videoGreetings.push(order)
    } else if (order.productType === 'toy' || order.productType === 'mixed') {
      physicalOrders.push(order)
      if (order.productData?.trackIds) {
        order.productData.trackIds.forEach((id: string) => purchasedTrackIds.add(id))
      }
    }
  })

  videoGreetings.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  physicalOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

  const uniqueTracks: MusicTrack[] = Array.from(purchasedTrackIds)
    .map(id => tracks.find(t => t.trackId === id))
    .filter((track): track is MusicTrack => Boolean(track))
    
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans" style={{ backgroundColor: "var(--background)" }}>
      <Header />

      <main className="flex-grow px-6 py-12 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Особистий кабінет</h1>
            <form action={signOut}>
              <Button type="submit">Вийти</Button>
            </form>
          </div>

          <UserInfo email={user?.email} />

          <VideoGreetingsList orders={videoGreetings} />

          <PhysicalOrdersList orders={physicalOrders} />

          <PurchasedTracksList tracks={uniqueTracks} />
        </div>
      </main>

      <Footer />
    </div>
  )
}