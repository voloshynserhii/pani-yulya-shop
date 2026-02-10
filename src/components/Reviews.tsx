"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Autoplay from "embla-carousel-autoplay";
import { MessageSquarePlus, X } from "lucide-react";

import { Card, CardContent, Button } from "@/components/ui";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Review {
  _id: string;
  name: string;
  text: string;
  validated: boolean;
}

const defaultFormData: Partial<Review> = {
  name: "",
  text: "",
};

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Review>>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reviews");
      const result = await response.json();
      if (result.success) {
        setReviewsList(result.reviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const plugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/add-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchReviews();
        
        setFormData(defaultFormData);
        setIsModalOpen(false);
        alert("Дякуємо за ваш відгук! Він з'явиться на сайті після перевірки модератором.");
      } else {
        alert("Не вдалося додати відгук. Спробуйте пізніше.");
      }
    } catch (error) {
      console.error(error);
      alert("Не вдалося додати відгук. Спробуйте пізніше.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Що кажуть про Пані Юлю
          </h2>
          <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Відгуки батьків та дітей про відеопривітання, пісні та рекомендації.
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 rounded-full"
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" /> Залишити відгук
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center text-zinc-600">
            <p>Завантаження відгуків...</p>
          </div>
        ) : reviewsList.length > 0 ? (
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
              {reviewsList.map((review) => (
                <CarouselItem key={review._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Card className="h-full flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardContent className="flex flex-col items-center justify-start text-center p-8 flex-grow">
                        <p className="text-lg font-semibold text-zinc-900">{review.name}</p>
                        <blockquote className="text-zinc-700 italic leading-relaxed flex-grow">
                          &quot;{review.text}&quot;
                        </blockquote>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="text-center text-zinc-600 py-8">
            <p className="text-lg">Ще немає відгуків. Будьте першим, хто залишить свій!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in duration-200" style={{ backgroundColor: "var(--secondary)" }}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="mb-6 text-xl font-bold text-zinc-900">Написати відгук</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-zinc-700">Ваше ім&apos;я</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Олена Петрівна"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="review" className="text-sm font-medium text-zinc-700">Ваш відгук</label>
                <textarea
                  id="review"
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Напишіть свої враження..."
                />
              </div>

              <Button type="submit" className="w-full rounded-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? "Надсилаємо..." : "Надіслати відгук"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}