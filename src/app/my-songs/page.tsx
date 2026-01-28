import Header from '@/components/Header'
import MusicTracksSection from '@/containers/MusicTracks'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Пісні Пані Юлі — Слухати та Завантажити',
  description: 'Переглядайте та слухайте ваші улюблені музичні треки.'
}

export default function MySongsPage() {
  return (
    <>
      <Header />
      <MusicTracksSection />
      <Footer />
    </>
  )
}
