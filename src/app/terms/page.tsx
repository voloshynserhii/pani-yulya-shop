import { Header } from '@/components/Header'
import Footer from '@/containers/Footer'

export const metadata = {
  title: 'Правила та умови',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex-grow">
        <section className="py-24 px-6 pt-32">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Правила та умови (Terms and Conditions)</h1>
            
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <h2 className="text-xl font-semibold">1. Загальні положення</h2>
              <p>
                Ці Правила та умови регулюють використання сайту та замовлення послуг/товарів (персональні відеопривітання, аудіофайли) через наш інтернет-магазин.
              </p>

              <h2 className="text-xl font-semibold">2. Послуги та Товари</h2>
              <p>
                Ми надаємо послуги зі створення персональних відеопривітань та продажу цифрових аудіозаписів. Детальний опис кожної послуги/товару доступний на відповідних сторінках сайту.
              </p>

              <h2 className="text-xl font-semibold">3. Умови та терміни надання послуг</h2>
              <p>
                <strong>Відеопривітання:</strong> Термін виконання замовлення складає від 1 до 3 робочих днів після отримання оплати та всієї необхідної інформації від замовника. Готове відео надсилається у вигляді посилання для завантаження або перегляду.
              </p>
              <p>
                <strong>Аудіофайли:</strong> Доступ до завантаження аудіофайлів надається миттєво або протягом 24 годин після успішної оплати.
              </p>

              <h2 className="text-xl font-semibold">4. Оплата</h2>
              <p>
                Оплата здійснюється у національній валюті України (гривня). Ми приймаємо оплату банківськими картками Visa та MasterCard через платіжний сервіс WayForPay.
              </p>

              <h2 className="text-xl font-semibold">5. Доставка</h2>
              <p>
                Всі товари та послуги є цифровими. Доставка здійснюється електронними каналами зв&apos;язку (електронна пошта, месенджери Telegram/Viber), вказаними клієнтом при оформленні замовлення. Фізична доставка не здійснюється.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}