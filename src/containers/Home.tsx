"use client"

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import OrderSection from '@/containers/OrderContainer'
import Reviews from '@/components/Reviews'
import MusicTracks from './MusicTracks'
import About from './About'
import Footer from '../components/Footer'

export default function HomeContainer() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
      <Header />
      <Hero
        imageSrc="/images/hero_image.jpeg"
        imageAlt="Pani Yulya Kids"
        title={
          <>
            Друзі, привіт!
            <br />
            Це я, Пані Юля!
          </>
        }
        description={
          <>
            Я допомагаю дітям пізнавати світ через відео, пісні та гру,
            <br />
            а батькам - бути спокійними за контент, який вони вмикають.
            <br />
            Тут все створено з турботою і теплом.
          </>
        }
        buttonText="Більше про Пані Юлю"
        buttonLink="/about"
        imagePosition="left"
      />

      <OrderSection />
      <Reviews />
      <MusicTracks />
      <About />
      <Footer />
    </div>
  )
}
