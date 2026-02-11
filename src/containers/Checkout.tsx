'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Input, Label } from '@/components/ui'
import { createWayForPayInvoice, saveOrderToDb } from '@/app/actions'
import { CheckCircleIcon, XMarkIcon, ExclamationCircleIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { MusicTrack } from '@/types'

interface CartItem extends Omit<MusicTrack, 'trackId'> {
    type?: 'toy' | 'music_track'
    toyId?: string
    trackId?: string
    quantity?: number
}

const Checkout = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showSuccess, setShowSuccess] = useState(false)
    const [showPending, setShowPending] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [email, setEmail] = useState('')
    const [deliveryForm, setDeliveryForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        warehouse: ''
    })

    useEffect(() => {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart).map((item: CartItem) => ({
                ...item,
                quantity: item.quantity || 1
            }))
            setCartItems(parsedCart)
        }
    }, [])

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    const toys = cartItems.filter((item) => item.type === 'toy')
    const tracks = cartItems.filter((item) => item.type !== 'toy')
    const hasToys = toys.length > 0
    
    useEffect(() => {
        const status = searchParams.get('status')
        const reason = searchParams.get('reason')

        if (status === 'success') {
            setShowSuccess(true)
            localStorage.removeItem('cart')
            setCartItems([])
            window.dispatchEvent(new Event("cart-updated"))
        }  else if (status === 'pending') {
            setShowPending(true)
            localStorage.removeItem('cart')
            setCartItems([])
            window.dispatchEvent(new Event("cart-updated"))
        } else if (status === 'error' || status === 'failed') {
            setErrorMessage(`Помилка оплати. Код: ${reason || 'невідомий'}`)
        }
    }, [searchParams])

    const closeError = () => {
        setErrorMessage('')
        router.replace('/checkout')
    }

    const handleRemoveItem = (id: string, type: 'toy' | 'music_track' = 'music_track') => {
        const updatedCart = cartItems.filter((item) => {
            if (type === 'toy') return item.toyId !== id
            return item.trackId !== id
        })
        setCartItems(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
        window.dispatchEvent(new Event("cart-updated"))
    }

    const updateQuantity = (id: string, delta: number) => {
        const updatedCart = cartItems.map(item => {
            if (item.toyId === id) {
                const newQuantity = (item.quantity || 1) + delta
                return { ...item, quantity: Math.max(1, newQuantity) }
            }
            return item
        })
        setCartItems(updatedCart)
        localStorage.setItem('cart', JSON.stringify(updatedCart))
    }

    const handlePayment = async () => {
        if (!email) {
            alert('Будь ласка, введіть email для отримання замовлення')
            return
        }
        if (hasToys && (!deliveryForm.firstName || !deliveryForm.lastName || !deliveryForm.phone || !deliveryForm.city || !deliveryForm.warehouse)) {
            alert('Будь ласка, заповніть всі поля доставки')
            return
        }

        setIsLoading(true)

        try {
            const orderReference = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`
            const orderDate = Math.floor(Date.now() / 1000);
            const merchantDomainName = typeof window !== 'undefined' ? window.location.hostname : 'pani-yulya.kids'

            const productNames = cartItems.map((t) => t.title)
            const productCounts = cartItems.map((t) => t.quantity || 1)
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
                let productType = 'music_track'
                if (hasToys && tracks.length > 0) productType = 'mixed'
                else if (hasToys) productType = 'toy'

                const productData: any = {}
                if (tracks.length > 0) productData.trackIds = tracks.map(t => t.trackId)
                if (hasToys) productData.toyIds = toys.map(t => ({ toyId: t.toyId, quantity: t.quantity || 1 }))

                const contacts: any = { email }
                if (hasToys) contacts.delivery = deliveryForm

                await saveOrderToDb({
                    reference: orderReference,
                    amount: +totalAmount.toFixed(2),
                    currency: 'UAH',
                    productType,
                    productData,
                    contacts,
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

    const isDisabled = isLoading || cartItems.length === 0 || !email || (hasToys && (!deliveryForm.firstName || !deliveryForm.lastName || !deliveryForm.phone || !deliveryForm.city || !deliveryForm.warehouse))


    return (
        <main className="flex-grow py-24 px-6 pt-32">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.length === 0 && (
                            <p className="text-muted-foreground">Кошик порожній</p>
                        )}

                        {tracks.map((track) => (
                            <div key={track.trackId} className="flex items-center gap-4 p-4 rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image src={track.coverSrc} alt={track.title} fill className="object-cover rounded-md" loading="lazy" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium">{track.title}</h3>
                                    <p className="text-sm text-muted-foreground">MP3 • Висока якість</p>
                                </div>
                                <div className="font-semibold mr-2">{track.price} грн</div>
                                <button onClick={() => handleRemoveItem(track.trackId!, 'music_track')} className="text-zinc-400 hover:text-red-500 transition-colors">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}

                        {toys.map((toy) => (
                            <div key={toy.toyId} className="flex items-center gap-4 p-4 rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image src={toy.coverSrc} alt={toy.title} fill className="object-cover rounded-md" loading="lazy" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium">{toy.title}</h3>
                                    <p className="text-sm text-muted-foreground">Іграшка</p>
                                </div>
                                
                                <div className="flex items-center gap-3 mr-4">
                                    <button 
                                        onClick={() => updateQuantity(toy.toyId!, -1)}
                                        className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500"
                                        disabled={toy.quantity === 1}
                                    >
                                        <MinusIcon className="h-4 w-4" />
                                    </button>
                                    <span className="font-medium w-4 text-center">{toy.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(toy.toyId!, 1)}
                                        className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="font-semibold mr-2">{(toy.price || 0) * (toy.quantity || 1)} грн</div>
                                <button onClick={() => handleRemoveItem(toy.toyId!, 'toy')} className="text-zinc-400 hover:text-red-500 transition-colors">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))}

                        {hasToys && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 mt-8" style={{ backgroundColor: "var(--secondary)" }}>
                                <h2 className="text-xl font-semibold mb-4">Дані для доставки (Нова Пошта)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Ім&apos;я</Label>
                                        <Input value={deliveryForm.firstName} onChange={(e: any) => setDeliveryForm({...deliveryForm, firstName: e.target.value})} placeholder="Іван" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Прізвище</Label>
                                        <Input value={deliveryForm.lastName} onChange={(e: any) => setDeliveryForm({...deliveryForm, lastName: e.target.value})} placeholder="Петренко" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Телефон</Label>
                                        <Input value={deliveryForm.phone} onChange={(e: any) => setDeliveryForm({...deliveryForm, phone: e.target.value})} placeholder="+380..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Місто</Label>
                                        <Input value={deliveryForm.city} onChange={(e: any) => setDeliveryForm({...deliveryForm, city: e.target.value})} placeholder="Київ" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Відділення / Поштомат</Label>
                                        <Input value={deliveryForm.warehouse} onChange={(e: any) => setDeliveryForm({...deliveryForm, warehouse: e.target.value})} placeholder="Відділення №1" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 sticky top-24" style={{ backgroundColor: "var(--secondary)" }}>
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
                                <span>Кількість товарів:</span>
                                <span>{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between mb-6 text-xl font-bold">
                                <span>Сума до сплати:</span>
                                <span>{totalAmount} грн</span>
                            </div>

                            <Button
                                size="lg"
                                className={`w-full transition-colors duration-200 ${isDisabled ? 'cursor-not-allowed' : ''}`}
                                backgroundColor={isDisabled ? 'var(--disabledBtn)' : 'var(--foreground)'}
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
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl relative">
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

            {/* Pending Modal */}
            {showPending && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl relative">
                        <button onClick={() => setShowPending(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                            <ExclamationCircleIcon className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Оплата в обробці</h2>
                        <p className="text-muted-foreground mb-6">Ваш платіж перевіряється банком. Це може зайняти деякий час. Ми надішлемо вам лист, як тільки оплата пройде.</p>

                        <Button onClick={() => router.push('/')} className="w-full">На головну</Button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl relative">
                        <button onClick={() => setShowSuccess(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircleIcon className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Оплата успішна!</h2>
                        <p className="text-muted-foreground mb-6">Дякуємо за покупку!</p>

                        <Button onClick={() => router.push('/account')} className="w-full">Перейти до облікового запису</Button>
                    </div>
                </div>
            )}
        </main>
    )
};

export default Checkout;