"use client"

import React from 'react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import ContactForm from '@/components/ContactForm'
import Image from 'next/image'

export default function HomeContainer() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <Hero
        imageSrc="/images/hero_image.jpeg"
        imageAlt="Hero Image"
        title={
          <>
            Друзі, привіт!
            <br />
            Це я, Пані Юля!
          </>
        }
        description="Я допомагаю дітям пізнавати світ через відео, пісні ті гру, а батькам - бути спокійними за контент, який вони вмикають. Тут все створено з турботою і теплом."
        buttonText="Дізнатися більше"
        buttonLink="/about"
        imagePosition="left"
      />
      <main className="flex min-h-screen w-full flex-col items-center justify-between py-24 px-6 sm:items-start" style={{ backgroundColor: "var(--secondary)" }}>
        <div className="w-full flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/2">
            <ContactForm />
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80"
              alt="Cover"
              width={800}
              height={600}
              className="w-full max-w-md rounded-md object-cover shadow-sm"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
