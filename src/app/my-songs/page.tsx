import Header from '@/components/Header'
import MusicTracksSection from '@/containers/MusicTracks'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Мої пісні',
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
