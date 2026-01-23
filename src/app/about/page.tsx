import { Header } from '@/components/Header';
import Footer from '@/containers/Footer'

export const metadata = {
  title: 'Про Пані Юлю',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <section className="min-h-screen flex items-center justify-center py-24 px-6 pt-32">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-4">Про мене</h1>
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Ласкаво просимо — це сторінка про мене. Тут можна додати інформацію
            про проект, авторів та контактні деталі.
          </p>
        </div>
      </section>
      <Footer />
    </>
  )
}
