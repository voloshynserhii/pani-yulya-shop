import Header from '@/components/Header';
import OrderSection from '@/containers/OrderContainer'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Замовити відеопривітання — Пані Юля Kids',
  description: 'Замовляйте персональні відеопривітання для своєї дитини.'
}

export default function VideoPage() {
  return (
    <>
      <Header />
      <OrderSection />
      <Footer />
    </>
  )
}
