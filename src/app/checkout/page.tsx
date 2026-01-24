'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/Header'
import Footer from '@/containers/Footer'
import { Button, Input, Label } from '@/components/ui'
import { createWayForPayInvoice, saveOrderToDb } from '@/app/actions'
import { CheckCircleIcon, XMarkIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)

  useEffect(() => {
    const status = searchParams.get('status')
    const reason = searchParams.get('reason')

    if (status === 'success') {
      setShowSuccess(true)
      localStorage.removeItem('cart')
      setCartItems([])
      window.dispatchEvent(new Event("cart-updated"))
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

  const handleRemoveItem = (trackId: string) => {
    const updatedCart = cartItems.filter((item) => item.trackId !== trackId)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cart-updated"))
  }

  const handlePayment = async () => {
    if (!email) {
      alert('Будь ласка, введіть email для отримання замовлення')
      return
    }

    setIsLoading(true)

    try {
      const orderReference = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      const orderDate = Math.floor(Date.now() / 1000);
      const merchantDomainName = typeof window !== 'undefined' ? window.location.hostname : 'pani-yulya.kids'

      const productNames = cartItems.map((t) => t.title)
      const productCounts = cartItems.map(() => 1)
      const productPrices = cartItems.map((t) => t.price)

      const result = await createWayForPayInvoice({
        merchantDomainName,
        orderReference,
        orderDate,
        amount: +totalAmount.toFixed(2),
        productName: productNames,
        productCount: productCounts,
        productPrice: productPrices,
      })

      if (result.success && result.url) {
        await saveOrderToDb({
          reference: orderReference,
          amount: +totalAmount.toFixed(2),
          currency: 'UAH',
          productType: 'music_track',
          productData: { trackIds: cartItems.map((t) => t.trackId) },
          contacts: { email },
          orderDate: new Date(),
        })

        window.location.href = result.url
      } else {
        setErrorMessage(result.message || 'Помилка при створенні оплати')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Сталася помилка при підготовці оплати')
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = isLoading || cartItems.length === 0 || !email


  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex-grow py-24 px-6 pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 && (
                <p className="text-muted-foreground">Кошик порожній</p>
              )}
              {cartItems.map((track) => (
                <div key={track.trackId} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image src={track.coverSrc} alt={track.title} fill className="object-cover rounded-md" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">MP3 • Висока якість</p>
                  </div>
                  <div className="font-semibold mr-2">{track.price} грн</div>
                  <button onClick={() => handleRemoveItem(track.trackId)} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Разом</h2>

                <div className="space-y-2 mb-4">
                  <Label>Ваш Email</Label>
                  <Input
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex justify-between mb-2">
                  <span>Кількість треків:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between mb-6 text-xl font-bold">
                  <span>Сума до сплати:</span>
                  <span>{totalAmount} грн</span>
                </div>

                <Button
                  size="lg"
                  className={`w-full transition-colors duration-200 ${isDisabled ? 'cursor-not-allowed' : ''}`}
                  backgroundColor={isDisabled ? 'var(--disabledBtn)' : 'var(--foreground)' }
                  onClick={handlePayment}
                  disabled={isDisabled}
                >
                  {isLoading ? 'Обробка...' : 'Оплатити через WayForPay'}
                </Button>
              </div>
            </div>
          </div>
        </div>

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