'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createWayForPayInvoice, saveOrderToDb } from '@/app/actions'
import CartItem, { CartItemType } from '@/components/CartItem'
import DeliveryForm, { DeliveryFormData } from '@/components/DeliveryForm'
import OrderSummary from '@/components/OrderSummary'
import StatusModal from '@/components/StatusModal'

const Checkout = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showSuccess, setShowSuccess] = useState(false)
    const [showPending, setShowPending] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [cartItems, setCartItems] = useState<CartItemType[]>([])
    const [email, setEmail] = useState('')
    const [deliveryForm, setDeliveryForm] = useState<DeliveryFormData>({
        firstName: '',
        lastName: '',
        phone: '',
        city: '',
        warehouse: ''
    })

    useEffect(() => {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart).map((item: CartItemType) => ({
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

    const handleDeliveryChange = (field: keyof DeliveryFormData, value: string) => {
        setDeliveryForm(prev => ({ ...prev, [field]: value }))
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
        <main className="flex-grow px-6 py-12 md:py-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Оформлення замовлення</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.length === 0 && (
                            <p className="text-muted-foreground">Кошик порожній</p>
                        )}

                        {tracks.map((track) => (
                            <CartItem 
                                key={track.trackId} 
                                item={track} 
                                onRemove={handleRemoveItem} 
                            />
                        ))}

                        {toys.map((toy) => (
                            <CartItem 
                                key={toy.toyId} 
                                item={toy} 
                                onRemove={handleRemoveItem} 
                                onUpdateQuantity={updateQuantity}
                            />
                        ))}

                        {hasToys && (
                            <DeliveryForm 
                                value={deliveryForm} 
                                onChange={handleDeliveryChange} 
                            />
                        )}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary 
                            email={email}
                            onEmailChange={setEmail}
                            totalCount={cartItems.length}
                            totalAmount={totalAmount}
                            isLoading={isLoading}
                            isDisabled={isDisabled}
                            onPayment={handlePayment}
                        />
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            <StatusModal 
                isOpen={!!errorMessage}
                type="error"
                title="Помилка"
                message={errorMessage}
                onClose={closeError}
                actionLabel="Закрити"
                onAction={closeError}
            />

            {/* Pending Modal */}
            <StatusModal 
                isOpen={showPending}
                type="pending"
                title="Оплата в обробці"
                message="Ваш платіж перевіряється банком. Це може зайняти деякий час. Ми надішлемо вам лист, як тільки оплата пройде."
                onClose={() => setShowPending(false)}
                actionLabel="На головну"
                onAction={() => router.push('/')}
            />

            {/* Success Modal */}
            <StatusModal 
                isOpen={showSuccess}
                type="success"
                title="Оплата успішна!"
                message="Дякуємо за покупку!"
                onClose={() => setShowSuccess(false)}
                actionLabel="Перейти до облікового запису"
                onAction={() => router.push('/account')}
            />
        </main>
    )
};

export default Checkout;