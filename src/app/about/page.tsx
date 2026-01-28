import Header from '@/components/Header'
import Footer from '@/components/Footer'
import About from '@/containers/About'

export const metadata = {
  title: 'Про Пані Юлю — Історія та Місія',
  description: 'Дізнайтеся більше про мене, мою історію та місію створення цього сайту.'
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
