'use client'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Checkout from '@/containers/Checkout'

function CheckoutContent() {
  return (
    <div className="flex min-h-screen flex-col font-sans" style={{ backgroundColor: "var(--background)" }}>
      <Header />
      <Checkout />
      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Завантаження...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}