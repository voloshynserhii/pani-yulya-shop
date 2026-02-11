import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ToyCard from '@/components/ToyCard'
import { toys } from '@/data/toys'

export const metadata = {
  title: 'Іграшки з відео та рекомендації | Pani Yulya Kids',
  description: 'Іграшки, які з\'являлися у відео на каналі Пані Юля, або рекомендовані нею для дітей.'
}

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Іграшки з відео та рекомендації
            </h1>
            <p className="text-lg max-w-2xl mx-auto">
              Тут ви знайдете іграшки, які з&apos;являлися у відео на каналі Пані Юля, або рекомендовані нею для розвитку та розваг ваших дітей.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {toys.filter(toy => toy.available !== false).map((toy) => (
              <ToyCard key={toy._id} toy={toy} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}