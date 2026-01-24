"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, Button } from "@/components/ui";
import ProtectedAudioPlayer from "@/components/ProtectedAudioPlayer";

interface MusicTrackCardProps {
  trackId: string;          // ← ключове
  title: string;
  coverSrc: string;
  hasAccess: boolean;       // ← після покупки
  price?: number;
}

export default function MusicTrackCard({
  trackId,
  title,
  coverSrc,
  hasAccess = false,
  price = 50,
}: MusicTrackCardProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isInCart, setIsInCart] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setIsInCart(cart.some((i: any) => i.trackId === trackId));
  }, [trackId]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleCartAction = () => {
    if (isInCart) {
      router.push("/checkout");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = { trackId, title, coverSrc, price };
    
    if (!cart.some((i: any) => i.trackId === trackId)) {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  return (
    <Card className="w-full overflow-hidden rounded-2xl shadow-sm">
      {/* Cover */}
      <div className="relative aspect-square">
        <Image
          src={coverSrc}
          alt={title}
          fill
          className="object-cover"
        />

        {/* Overlay */}
        <button
          onClick={togglePlay}
          className={'absolute inset-0 flex items-center justify-center transition bg-black/40 opacity-0 hover:opacity-100'}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-12 w-12 text-white" />
          ) : (
            <Play className="h-12 w-12 text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-medium leading-tight">{title}</h3>

       {!hasAccess ? (
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">{price} грн</span>
            <Button size="sm" onClick={handleCartAction}>
              {isInCart ? "Вже в кошику" : "Купити"}
            </Button>
          </div>
        ) : (
          <div className="pt-2 text-green-600 font-semibold">Доступно для скачування в профілі</div>
        )}
      </div>

        <ProtectedAudioPlayer
        ref={audioRef}
        trackId={trackId}
        onEnded={() => setIsPlaying(false)}
        />
    </Card>
  );
}
