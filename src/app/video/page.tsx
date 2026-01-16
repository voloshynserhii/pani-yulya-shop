import { Header } from '@/components/Header';

export const metadata = {
  title: 'Відео',
}

export default function VideoPage() {
  return (
    <>
      <Header />
      <section className="min-h-screen py-24 px-6 pt-16">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-6">Відео</h1>
        <p className="mb-6 text-(--foreground)">Тут можна розмістити відео або плейлист.</p>

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
    </>
  )
}
