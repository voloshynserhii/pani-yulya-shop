"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { reviews } from "@/data/reviews";

export default function Reviews() {
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-zinc-900">
            Що кажуть про Пані Юлю
          </h2>
          <p className="max-w-[900px] text-zinc-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Відгуки щасливих батьків та дітей про відеопривітання, пісні та рекомендації.
          </p>
        </div>
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-6xl mx-auto"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-1">
                  <Card className="h-full flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center justify-start text-center p-8 flex-grow">
                      <div className="mb-4">
                        <Image
                          src={review.avatarSrc}
                          alt={`Avatar of ${review.name}`}
                          width={72}
                          height={72}
                          className="rounded-full"
                        />
                      </div>
                      <p className="text-lg font-semibold text-zinc-900">{review.name}</p>
                      <p className="text-sm text-zinc-500 mb-4">{review.handle}</p>
                      <blockquote className="text-zinc-700 italic leading-relaxed flex-grow">
                        "{review.text}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}