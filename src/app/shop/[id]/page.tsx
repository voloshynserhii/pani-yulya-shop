"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingCart, ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui";
import { toys, Toy } from "@/data/toys";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";

interface CartItem extends Toy {
    type?: 'toy' | 'music_track'
    toyId?: string
}

interface MediaItem {
    type: 'image' | 'video';
    src: string;
    poster?: string;
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default function ToyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toy = toys.find((t) => t._id === id);
  const [isInCart, setIsInCart] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (toy) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cart.some((item: CartItem) => item.toyId === toy._id);
      setIsInCart(exists);
    }
  }, [toy]);

  useEffect(() => {
    setIsPlaying(false);
  }, [selectedMediaIndex]);

  if (!toy) {
    notFound();
  }

  const media: MediaItem[] = (toy as any).media || [
    { type: 'image', src: toy.imageSrc }
  ];

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const item = {
      toyId: toy._id,
      title: toy.title,
      coverSrc: toy.imageSrc,
      price: toy.price,
      type: 'toy'
    };

    if (!cart.some((i: CartItem) => i.toyId === toy._id)) {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans">
      <Header />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/shop" 
              className="inline-flex items-center text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до вибору іграшок
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Section */}
              <div className="flex flex-col gap-4 p-6 md:p-8">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100">
                  {media[selectedMediaIndex].type === 'video' ? (
                    (() => {
                      const videoId = getYouTubeId(media[selectedMediaIndex].src);
                      return videoId ? (
                      isPlaying ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                          className="w-full h-full object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div 
                          className="w-full h-full relative cursor-pointer group flex items-center justify-center"
                          onClick={() => setIsPlaying(true)}
                        >
                          {(() => {
                            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                            return thumbnailUrl ? (
                              <Image
                                src={thumbnailUrl}
                                alt={toy.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                              />
                            ) : null;
                          })()}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Play className="w-8 h-8 text-red-600 fill-current ml-1" />
                          </div>
                        </div>
                      )
                    ) : (
                      <video
                        src={media[selectedMediaIndex].src}
                        controls
                        className="w-full h-full object-contain"
                      />
                    );
                    })()
                  ) : (
                    <Image
                      src={media[selectedMediaIndex].src}
                      alt={toy.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  )}
                </div>

                {media.length > 1 && (
                  <Carousel setApi={setApi} className="w-full max-w-sm mx-auto px-8">
                    <CarouselContent className="-ml-2">
                      {media.map((item, index) => (
                        <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/5">
                          <div
                            className={cn(
                              "relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                              selectedMediaIndex === index
                                ? "border-blue-600 opacity-100 ring-2 ring-blue-100"
                                : "border-transparent opacity-70 hover:opacity-100 hover:border-zinc-300"
                            )}
                            onClick={() => setSelectedMediaIndex(index)}
                          >
                            {item.type === 'video' ? (
                              <div className="w-full h-full bg-zinc-100 flex items-center justify-center relative">
                                {(() => {
                                  const videoId = getYouTubeId(item.src);
                                  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : item.poster;
                                  return thumbnailUrl ? (
                                    <Image
                                        src={thumbnailUrl}
                                        alt={`Video thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                  ) : null;
                                })()}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                                        <Play className="w-4 h-4 text-zinc-900 fill-zinc-900" />
                                    </div>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={item.src}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0" />
                    <CarouselNext className="right-0" />
                  </Carousel>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-zinc-400 text-sm">ID: {toy._id}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6 leading-tight">
                  {toy.title}
                </h1>

                <div className="prose prose-zinc max-w-none mb-8 text-zinc-600 leading-relaxed">
                  <p>{toy.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto pt-8 border-t border-zinc-100">
                  <span className="text-4xl font-bold text-zinc-900">{toy.price} грн</span>
                  
                  <Button 
                    size="lg" 
                    onClick={addToCart} 
                    disabled={isInCart} 
                    className="w-full sm:w-auto px-8 h-14 text-lg rounded-full"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isInCart ? "В кошику" : "Додати в кошик"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}