export const metadata = {
  title: 'Відео',
}

export default function VideoPage() {
  return (
    <section className="min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Відео</h1>
        <p className="mb-6 text-zinc-700 dark:text-zinc-300">Тут можна розмістити відео або плейлист.</p>

        <div className="aspect-video w-full overflow-hidden rounded-md border">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
