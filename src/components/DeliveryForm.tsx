import { Input, Label } from '@/components/ui'

export interface DeliveryFormData {
    firstName: string
    lastName: string
    phone: string
    city: string
    warehouse: string
}

interface DeliveryFormProps {
    value: DeliveryFormData
    onChange: (field: keyof DeliveryFormData, value: string) => void
}

export default function DeliveryForm({ value, onChange }: DeliveryFormProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 mt-8" style={{ backgroundColor: "var(--secondary)" }}>
            <h2 className="text-xl font-semibold mb-4">Дані для доставки (Нова Пошта)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Ім&apos;я</Label>
                    <Input value={value.firstName} onChange={(e: any) => onChange('firstName', e.target.value)} placeholder="Іван" />
                </div>
                <div className="space-y-2">
                    <Label>Прізвище</Label>
                    <Input value={value.lastName} onChange={(e: any) => onChange('lastName', e.target.value)} placeholder="Петренко" />
                </div>
                <div className="space-y-2">
                    <Label>Телефон</Label>
                    <Input value={value.phone} onChange={(e: any) => onChange('phone', e.target.value)} placeholder="+380..." />
                </div>
                <div className="space-y-2">
                    <Label>Країна</Label>
                    <select className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" disabled>
                        <option>Україна</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Місто</Label>
                    <Input value={value.city} onChange={(e: any) => onChange('city', e.target.value)} placeholder="Київ" />
                </div>
                <div className="space-y-2">
                    <Label>Відділення / Поштомат</Label>
                    <Input value={value.warehouse} onChange={(e: any) => onChange('warehouse', e.target.value)} placeholder="Відділення №1" />
                </div>
            </div>
        </div>
    )
}
