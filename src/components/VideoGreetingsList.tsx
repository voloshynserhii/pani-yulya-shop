import { Order } from '@/types'

export default function VideoGreetingsList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мої відеопривітання</h2>
      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
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
  )
}
