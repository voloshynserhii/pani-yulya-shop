import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Контакти',
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
      <Header />
      <main className="flex-grow">
        <section className="py-24 px-6 pt-32">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Контактна інформація</h1>
            
            <div className="space-y-6 text-zinc-700">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-200">
                <h2 className="text-xl font-semibold mb-4">Реквізити</h2>
                <ul className="space-y-3">
                  <li>
                    <span className="font-medium block text-zinc-900">Повне найменування:</span>
                    ФОП Колодєєва Юлія Михаїлівна
                  </li>
                  <li>
                    <span className="font-medium block text-zinc-900">ІПН:</span>
                    3425312660
                  </li>
                  <li>
                    <span className="font-medium block text-zinc-900">Юридична адреса:</span>
                    м.Харків, вул. Сніжківська, буд. 50, 61033
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-zinc-200">
                <h2 className="text-xl font-semibold mb-4">Зв&apos;язок зі мною</h2>
                <ul className="space-y-3">
                  <li>
                    <span className="font-medium block text-zinc-900">Email:</span>
                    <a href="mailto:kolodyulya@gmail.com" className="hover:text-blue-600 transition-colors">kolodyulya@gmail.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}