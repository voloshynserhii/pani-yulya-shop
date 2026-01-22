"use client";

import { forwardRef } from "react";

interface ProtectedAudioPlayerProps {
  trackId: string;
  onEnded?: () => void;
}

const ProtectedAudioPlayer = forwardRef<
  HTMLAudioElement,
  ProtectedAudioPlayerProps
>(({ trackId, onEnded }, ref) => {
  return (
    <audio
      ref={ref}
      src={`/api/audio/${trackId}.mp3`}
      preload="none"
      onEnded={onEnded}
    />
  );
});

ProtectedAudioPlayer.displayName = "ProtectedAudioPlayer";

export default ProtectedAudioPlayer;
