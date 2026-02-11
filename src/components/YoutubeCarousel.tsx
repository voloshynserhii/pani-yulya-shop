"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel"
import { Play } from "lucide-react"

const YOUTUBE_VIDEOS = [
  "https://youtu.be/1ZsLV1eH5Fw?si=cz_oeJUBIYlnBGK8",
  "https://youtu.be/Q0oJlKsxU7o?feature=shared",
  "https://youtu.be/7AWII9Q5hcc?feature=shared",
  "https://youtu.be/lkZkRt5fPVs?feature=shared",
  "https://youtu.be/R7Qk8iBqkdk?feature=shared",
  "https://youtu.be/JuMaELf9h1U?feature=shared",
  "https://youtu.be/p4uUtjA_G9k?feature=shared",
  "https://youtu.be/sQKcSFyIFOY?feature=shared",
  "https://youtu.be/YBZg2QT-AGU?feature=shared",
  "https://youtu.be/3IuJ-MYeLbc?feature=shared",
  "https://youtu.be/gcGuKhdpnrQ?feature=shared",
  "https://youtu.be/bk44h79Y2gM?feature=shared",
  "https://youtu.be/WjOP6OPQhB4?feature=shared",
  "https://youtu.be/Gueh2mINOLQ?feature=shared",
]

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : url
}

export default function YoutubeCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
      setPlayingVideoId(null)
    }
    
    const onReInit = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap() + 1)
    }

    api.on("select", onSelect)
    api.on("reInit", onReInit)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onReInit)
    }
  }, [api])

  return (
    <section className="w-full py-16 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-[30px] sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
          Розважально-навчальні відео для дітей українською
        </h2>
        <div className="px-4 sm:px-12">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {YOUTUBE_VIDEOS.map((url) => {
                const id = getYouTubeId(url)
                const isPlaying = playingVideoId === id

                return (
                  <CarouselItem key={id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-zinc-200 shadow-sm relative">
                    {isPlaying ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setPlayingVideoId(id)}
                        className="w-full h-full group relative flex items-center justify-center cursor-pointer"
                        aria-label="Play video"
                      >
                        <Image
                          src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
                          alt="Video thumbnail"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute h-12 w-12 sm:h-16 sm:w-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          <Play className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 fill-current ml-1" />
                        </div>
                      </button>
                    )}
                  </div>
                </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
          
          <div className="flex justify-center gap-2 mt-4 sm:hidden">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === current - 1 ? "bg-zinc-800 w-4" : "bg-zinc-300"
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}