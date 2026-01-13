"use client"

import React from 'react'
import { Header } from '@/components/Header'
import ContactForm from '@/components/ContactForm'
import Image from 'next/image'

export default function HomeContainer() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between py-24 px-6 bg-white dark:bg-black sm:items-start">
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
