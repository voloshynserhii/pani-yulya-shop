"use client";

import { forwardRef, AudioHTMLAttributes } from "react";

interface ProtectedAudioPlayerProps extends AudioHTMLAttributes<HTMLAudioElement> {
  trackId: string;
}

const ProtectedAudioPlayer = forwardRef<
  HTMLAudioElement,
  ProtectedAudioPlayerProps
>(({ trackId, ...props }, ref) => {
  return (
    <audio
      ref={ref}
      src={`/api/audio/${trackId}.mp3`}
      preload="none"
      {...props}
    />
  );
});

ProtectedAudioPlayer.displayName = "ProtectedAudioPlayer";

export default ProtectedAudioPlayer;
