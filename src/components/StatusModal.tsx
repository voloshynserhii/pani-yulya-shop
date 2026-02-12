import { Button } from '@/components/ui'
import { CheckCircleIcon, XMarkIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface StatusModalProps {
    isOpen: boolean
    type: 'success' | 'pending' | 'error'
    title: string
    message: string
    onClose: () => void
    actionLabel: string
    onAction: () => void
}

export default function StatusModal({ isOpen, type, title, message, onClose, actionLabel, onAction }: StatusModalProps) {
    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><CheckCircleIcon className="h-10 w-10" /></div>
            case 'pending':
                return <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4"><ExclamationCircleIcon className="h-10 w-10" /></div>
            case 'error':
                return <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4"><ExclamationCircleIcon className="h-10 w-10" /></div>
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                {getIcon()}
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button onClick={onAction} className="w-full">{actionLabel}</Button>
            </div>
        </div>
    )
}
