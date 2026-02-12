import Image from 'next/image'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui'
import { MusicTrack } from '@/types'

export default function PurchasedTracksList({ tracks }: { tracks: MusicTrack[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Мої музичні треки</h2>
      {tracks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div key={track.trackId} className="rounded-xl overflow-hidden shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
              <div className="relative aspect-square">
                <Image src={track.coverSrc} alt={track.title} fill className="object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{track.title}</h3>
                <audio controls className="w-full h-8" src={`/api/audio/${track.trackId}.mp3`} />
                <a
                  href={`/api/audio/download/${track.trackId}.mp3`}
                  download
                  style={{ backgroundColor: "var(--accent)" }}
                  className="flex items-center justify-center w-full mt-3 py-2 text-sm font-medium text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Завантажити
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
          <p className="text-zinc-500">У вас поки немає придбаних треків</p>
          <Button className="mt-4">
            <Link href="/my-songs">Перейти до каталогу</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
