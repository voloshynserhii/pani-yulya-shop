"use client";

import { useState, useEffect } from "react";
import MusicTrackCard from "@/components/MusicTrackCard";
import { Button } from "@/components/ui";
import { tracks } from "@/utils/musicTracks";
import { getPurchasedTrackIds } from "@/app/actions";

export default function MusicTracksSection() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [purchasedTrackIds, setPurchasedTrackIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccess = async () => {
      
      const ids = await getPurchasedTrackIds();
      if (ids?.length) setPurchasedTrackIds(ids);
    };

    fetchAccess();
  }, []);

  const handleToggleView = () => {
    if (visibleCount >= tracks.length) {
      setVisibleCount(6);
    } else {
      setVisibleCount((prev) => prev + 6);
    }
  };

  const displayedTracks = tracks.slice(0, visibleCount);
  const allShown = visibleCount >= tracks.length;

  return (
    <section className="w-full py-16" style={{ backgroundColor: "var(--primary)" }}>
      <div className="max-w-7xl mx-auto px-[30px] sm:px-6 lg:px-8">
        <header className="mb-10 space-y-3">
          <h2 className="text-3xl font-semibold">Музика Пані Юлі завжди з вами</h2>
          <p className="text-muted-foreground max-w-2xl">
            Улюблені пісні в MP3-форматі: без реклами, без інтернету, назавжди у вашій колекції
          </p>
          <p className="text-muted-foreground max-w-2xl">
            🚗 В дорозі: Слухайте в машині, навіть там, де не ловить зв’язок та немає Spotify.
            <br />
            📴 Офлайн-режим: Завантажте на планшет чи телефон, щоб малюк розважався у літаку, потязі чи під час відключень світла.
            <br />
            🎉 Дитяче свято: Віддайте флешку діджею або аніматору на Дні народження, щоб лунали тільки якісні українські пісні.
            <br />
            🧸 Безпека: Вмикайте пісні зі старого плеєра або колонки, щоб не давати дитині в руки телефон з доступом до YouTube.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTracks.map((track) => (
            <MusicTrackCard
              key={track.trackId}
              title={track.title}
              coverSrc={track.coverSrc}
              trackId={track.trackId}
              price={track.price}
              hasAccess={purchasedTrackIds.includes(track.trackId)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button size="lg" onClick={handleToggleView}>
            {allShown ? "Згорнути" : "Показати більше"}
          </Button>
        </div>
      </div>
    </section>
  );
}
