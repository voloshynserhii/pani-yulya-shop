export const metadata = {
  title: 'Мої пісні',
}

export default function MySongsPage() {
  const songs = [
    { id: 1, title: 'Пісня 1', desc: 'Короткий опис пісні 1' },
    { id: 2, title: 'Пісня 2', desc: 'Короткий опис пісні 2' },
    { id: 3, title: 'Пісня 3', desc: 'Короткий опис пісні 3' },
  ]

  return (
    <section className="min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Мої пісні</h1>
        <ul className="space-y-4">
          {songs.map((s) => (
            <li key={s.id} className="rounded-md border p-4">
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{s.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
