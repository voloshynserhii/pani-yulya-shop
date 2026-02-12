import Image from 'next/image'
import { Order } from '@/types'
import { toys as allToys } from '@/data/toys'
import { tracks } from '@/utils/musicTracks'

export default function PhysicalOrdersList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мої замовлення</h2>
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <div key={order.reference} className="p-6 rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-grow">
                <div className="border-b border-zinc-100 pb-4 flex justify-between items-start">
                  <div>
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
                  <div className="text-right">
                    <span className="font-bold text-lg">{order.amount} {order.currency}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.productData?.toyIds?.map((item: any) => {
                    const toy = allToys.find(t => t._id === item.id)
                    return toy ? (
                      <div key={item.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border border-zinc-100">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-zinc-100">
                            <Image src={toy.imageSrc} alt={toy.title} fill className="object-cover" />
                          </div>
                          <span className="font-medium">{toy.title}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-500 text-xs block">{item.quantity} шт.</span>
                          <span className="font-medium">{toy.price * item.quantity} грн</span>
                        </div>
                      </div>
                    ) : null
                  })}
                  {order.productData?.trackIds?.map((id: string) => {
                    const track = tracks.find(t => t.trackId === id)
                    return track ? (
                      <div key={id} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border border-zinc-100">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-zinc-100">
                            <Image src={track.coverSrc} alt={track.title} fill className="object-cover" />
                          </div>
                          <span className="font-medium">{track.title} (MP3)</span>
                        </div>
                        <span className="font-medium">{track.price} грн</span>
                      </div>
                    ) : null
                  })}
                </div>

                {order.contacts?.delivery && (
                  <div className="bg-white p-4 rounded-lg border border-zinc-100 text-sm">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium mb-2">Дані доставки</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p><span className="text-zinc-500">Отримувач:</span> {order.contacts.delivery.firstName} {order.contacts.delivery.lastName}</p>
                      <p><span className="text-zinc-500">Телефон:</span> {order.contacts.delivery.phone}</p>
                      <p className="sm:col-span-2"><span className="text-zinc-500">Адреса:</span> {order.contacts.delivery.city}, {order.contacts.delivery.warehouse}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center items-center rounded-lg p-6 min-w-[200px] text-center bg-white/50">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-green-700 mb-2">
                  Оплачено успішно
                </span>
                <p className="text-xs text-zinc-500">
                  Ми вже готуємо ваше замовлення до відправки. Очікуйте повідомлення з номером ТТН.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
