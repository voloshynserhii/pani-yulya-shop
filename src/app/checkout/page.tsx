'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/Header'
import Footer from '@/containers/Footer'
import { Button } from '@/components/ui'
import { tracks } from '@/utils/musicTracks'
import { generateWayForPaySignature } from '@/app/actions'
import { CheckCircleIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock cart: using all tracks for demonstration
  // In a real app, you'd pull this from a Context or LocalStorage
  const cartItems = tracks
  const PRICE_PER_TRACK = 50 // UAH
  const totalAmount = cartItems.length * PRICE_PER_TRACK

  useEffect(() => {
    const status = searchParams.get('status')
    const reason = searchParams.get('reason')

    if (status === 'success') {
      setShowSuccess(true)
    } else if (status === 'error') {
      if (reason === '1118') {
        setErrorMessage('Помилка підпису (1118). Перевірте секретний ключ в .env файлі.')
      } else {
        setErrorMessage(`Помилка оплати. Код: ${reason || 'невідомий'}`)
      }
    }
  }, [searchParams])

  const closeError = () => {
    setErrorMessage('')
    router.replace('/checkout')
  }

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const orderReference = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      const orderDate = Date.now()
      const merchantAccount = process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT || 'test_merch_n1' // Default to test merchant
      const merchantDomainName = typeof window !== 'undefined' ? window.location.hostname : 'pani-yulya.com'

      const productNames = cartItems.map((t) => t.title)
      const productCounts = cartItems.map(() => 1)
      const productPrices = cartItems.map(() => PRICE_PER_TRACK)

      const signature = await generateWayForPaySignature({
        merchantAccount,
        merchantDomainName,
        orderReference,
        orderDate,
        amount: totalAmount,
        currency: 'UAH',
        productName: productNames,
        productCount: productCounts,
        productPrice: productPrices,
      })

      // Fill form and submit
      if (formRef.current) {
        const form = formRef.current
        ;(form.elements.namedItem('orderReference') as HTMLInputElement).value = orderReference
        ;(form.elements.namedItem('orderDate') as HTMLInputElement).value = orderDate.toString()
        ;(form.elements.namedItem('merchantSignature') as HTMLInputElement).value = signature
        
        form.submit()
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Сталася помилка при підготовці оплати')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex-grow py-24 px-6 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((track) => (
                <div key={track.trackId} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image src={track.coverSrc} alt={track.title} fill className="object-cover rounded-md" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">MP3 • Висока якість</p>
                  </div>
                  <div className="font-semibold">{PRICE_PER_TRACK} грн</div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Разом</h2>
                <div className="flex justify-between mb-2">
                  <span>Кількість треків:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between mb-6 text-xl font-bold">
                  <span>Сума до сплати:</span>
                  <span>{totalAmount} грн</span>
                </div>
                <Button size="lg" className="w-full" onClick={handlePayment} disabled={isLoading}>
                  {isLoading ? 'Обробка...' : 'Оплатити через WayForPay'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden WayForPay Form */}
        <form ref={formRef} method="post" action="https://secure.wayforpay.com/pay" acceptCharset="utf-8" className="hidden">
          <input type="hidden" name="merchantAccount" value={process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT || 'test_merch_n1'} />
          <input type="hidden" name="merchantAuthType" value="SimpleSignature" />
          <input type="hidden" name="merchantDomainName" value="pani-yulya.com" />
          <input type="hidden" name="orderReference" value="" />
          <input type="hidden" name="orderDate" value="" />
          <input type="hidden" name="amount" value={totalAmount} />
          <input type="hidden" name="currency" value="UAH" />
          <input type="hidden" name="merchantSignature" value="" />
          <input type="hidden" name="returnUrl" value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/checkout/return`} />
          {cartItems.map((track, i) => (
            <div key={i}>
              <input type="hidden" name="productName[]" value={track.title} />
              <input type="hidden" name="productPrice[]" value={PRICE_PER_TRACK} />
              <input type="hidden" name="productCount[]" value="1" />
            </div>
          ))}
        </form>

        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center shadow-xl relative">
              <button onClick={closeError} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900">
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <ExclamationCircleIcon className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Помилка</h2>
              <p className="text-muted-foreground mb-6">{errorMessage}</p>
              <Button onClick={closeError} className="w-full">Закрити</Button>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-md w-full text-center shadow-xl relative">
              <button onClick={() => setShowSuccess(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900">
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Оплата успішна!</h2>
              <p className="text-muted-foreground mb-6">Дякуємо за покупку. Ваші файли вже доступні для завантаження в розділі "Мої пісні".</p>
              <Button onClick={() => router.push('/my-songs')} className="w-full">Перейти до пісень</Button>
            </div>
          </div>
        )}
      </main>
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