import Image from 'next/image'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { MusicTrack } from '@/types'

export interface CartItemType extends Omit<MusicTrack, 'trackId'> {
    type?: 'toy' | 'music_track'
    toyId?: string
    trackId?: string
    quantity?: number
}

interface CartItemProps {
    item: CartItemType
    onRemove: (id: string, type: 'toy' | 'music_track') => void
    onUpdateQuantity?: (id: string, delta: number) => void
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
    const isToy = item.type === 'toy'
    const id = isToy ? item.toyId : item.trackId

    if (!id) return null

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
            <div className="flex items-center gap-4 w-full sm:w-auto sm:flex-grow">
                <div className="relative w-16 h-16 flex-shrink-0">
                    <Image src={item.coverSrc} alt={item.title} fill className="object-cover rounded-md" loading="lazy" />
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="font-medium break-words">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{isToy ? 'Іграшка' : 'MP3 • Висока якість'}</p>
                </div>
            </div>
            
            <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
                {isToy && onUpdateQuantity && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => onUpdateQuantity(id, -1)}
                            className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500"
                            disabled={item.quantity === 1}
                        >
                            <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                            onClick={() => onUpdateQuantity(id, 1)}
                            className="p-1 rounded-full hover:bg-zinc-100 text-zinc-500"
                        >
                            <PlusIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <div className={`flex items-center gap-3 ${!isToy ? 'ml-auto' : ''}`}>
                    <div className="font-semibold whitespace-nowrap">{(item.price || 0) * (item.quantity || 1)} грн</div>
                    <button onClick={() => onRemove(id, item.type || 'music_track')} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
