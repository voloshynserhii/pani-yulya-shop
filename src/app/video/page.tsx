import { Header } from '@/components/Header';
import OrderSection from '@/containers/OrderContainer'
import Footer from '@/containers/Footer'

export const metadata = {
  title: 'Відео',
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
