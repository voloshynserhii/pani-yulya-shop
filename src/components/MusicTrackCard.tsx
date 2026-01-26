"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, Button } from "@/components/ui";
import ProtectedAudioPlayer from "@/components/ProtectedAudioPlayer";
import type { MusicTrack } from '@/types'

export default function MusicTrackCard({
  trackId,
  title,
  coverSrc,
  hasAccess = false,
  price = 50,
}: MusicTrack) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isInCart = cart.some((i: MusicTrack) => i.trackId === trackId);

    if (isInCart) setIsInCart(isInCart);
  }, [trackId]);

  useEffect(() => {
    const handleAudioPlay = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail.trackId !== trackId) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      }
    };

    window.addEventListener("audio-play", handleAudioPlay);
    return () => window.removeEventListener("audio-play", handleAudioPlay);
  }, [trackId]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      window.dispatchEvent(new CustomEvent("audio-play", { detail: { trackId } }));
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCartAction = () => {
    if (isInCart) {
      router.push("/checkout");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = { trackId, title, coverSrc, price };

    if (!cart.some((i: MusicTrack) => i.trackId === trackId)) {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const handleTimeUpdate = () => {
    if (!hasAccess && audioRef.current && audioRef.current.currentTime >= 20) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden rounded-2xl shadow-sm" style={{ backgroundColor: "var(--secondary)" }}>
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
          className={'absolute inset-0 flex items-center justify-center transition bg-black/40 opacity-50 hover:opacity-100 cursor-pointer'}
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
        onTimeUpdate={handleTimeUpdate}
      />
    </Card>
  );
}
