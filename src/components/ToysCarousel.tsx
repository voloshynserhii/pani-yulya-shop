"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel"
import { toys } from "@/data/toys"
import ToyCard from "@/components/ToyCard"

export default function ToysCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1)
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
    <section className="w-full py-16 bg-white" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-7xl mx-auto px-[30px] sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
          Іграшки з відео
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
              {toys.map((toy) => (
                <CarouselItem key={toy._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <ToyCard toy={toy} />
                  </div>
                </CarouselItem>
              ))}
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