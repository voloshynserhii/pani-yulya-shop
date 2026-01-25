import Header from '@/components/Header'
import Footer from '@/components/Footer'
import About from '@/containers/About'

export const metadata = {
  title: 'Про мене',
}

export default function AboutPage() {
  return (
    <div>
      <Header />
      <About />
      <Footer />
    </div>
  )
}
