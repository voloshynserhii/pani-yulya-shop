export const metadata = {
  title: 'Про нас',
}

export default function AboutPage() {
  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Про нас</h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          Ласкаво просимо — це сторінка про нас. Тут можна додати інформацію
          про проект, авторів та контактні деталі.
        </p>
      </div>
    </section>
  )
}
