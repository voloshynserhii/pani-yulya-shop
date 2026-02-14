import { Button, Input, Label } from '@/components/ui'

interface OrderSummaryProps {
    email: string
    onEmailChange: (value: string) => void
    totalCount: number
    totalAmount: number
    isLoading: boolean
    isDisabled: boolean
    onPayment: () => void
}

export default function OrderSummary({ 
    email, 
    onEmailChange, 
    totalCount, 
    totalAmount, 
    isLoading, 
    isDisabled, 
    onPayment 
}: OrderSummaryProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 sticky top-24" style={{ backgroundColor: "var(--secondary)" }}>
            <h2 className="text-xl font-semibold mb-4">Разом</h2>

            <div className="space-y-2 mb-4">
                <Label>Ваш Email</Label>
                <Input
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e: any) => onEmailChange(e.target.value.toLowerCase().trim())}
                />
            </div>

            <div className="flex justify-between mb-2">
                <span>Кількість товарів:</span>
                <span>{totalCount}</span>
            </div>
            <div className="flex justify-between mb-6 text-xl font-bold">
                <span>Сума до сплати:</span>
                <span>{totalAmount} грн</span>
            </div>

            <Button
                size="lg"
                className={`w-full transition-colors duration-200 ${isDisabled ? 'cursor-not-allowed' : ''}`}
                backgroundColor={isDisabled ? 'var(--disabledBtn)' : 'var(--foreground)'}
                onClick={onPayment}
                disabled={isDisabled}
            >
                {isLoading ? 'Обробка...' : 'Оплатити через WayForPay'}
            </Button>
        </div>
    )
}
