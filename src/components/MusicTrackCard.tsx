"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";

import { Card } from "@/components/ui";
import ProtectedAudioPlayer from "@/components/ProtectedAudioPlayer";

interface MusicTrackCardProps {
  trackId: string;          // ← ключове
  title: string;
  coverSrc: string;
  hasAccess: boolean;       // ← після покупки
}

export default function MusicTrackCard({
  trackId,
  title,
  coverSrc,
  hasAccess,
}: MusicTrackCardProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = async () => {
    if (!audioRef.current || !hasAccess) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      await audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-2xl shadow-sm">
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
          disabled={!hasAccess}
          className={`absolute inset-0 flex items-center justify-center transition
            ${hasAccess
              ? "bg-black/40 opacity-0 hover:opacity-100"
              : "bg-black/60 cursor-not-allowed"
            }`}
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

       {!hasAccess && (
          <p className="text-sm text-muted-foreground">
            Доступно після покупки
          </p>
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
