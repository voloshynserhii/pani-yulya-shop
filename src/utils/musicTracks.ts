interface MusicTrack {
  trackId: string;
  title: string;
  coverSrc: string;
  mp3Url: string;
  wavUrl: string;
}

export const tracks: MusicTrack[] = [
  {
    trackId: "doremi",
    title: "До Ре Мі",
    coverSrc: "/images/music/doremi.jpeg",
    mp3Url: "/music/doremi.mp3",
    wavUrl: "/music/doremi.wav",
  },
  {
    trackId: "zabka",
    title: "Жабка",
    coverSrc: "/images/music/zabka.jpeg",
    mp3Url: "/music/zabka.mp3",
    wavUrl: "/music/zabka.wav",
  },
  {
    trackId: "lito",
    title: "Літо",
    coverSrc: "/images/music/lito.png",
    mp3Url: "/music/lito.mp3",
    wavUrl: "/music/lito.wav",
  },
];