"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui";
import { toys, Toy } from "@/data/toys";

interface CartItem extends Toy {
    type?: 'toy' | 'music_track'
    toyId?: string
}

export default function ToyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toy = toys.find((t) => t._id === id);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (toy) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cart.some((item: CartItem) => item.toyId === toy._id);
      setIsInCart(exists);
    }
  }, [toy]);

  if (!toy) {
    notFound();
  }

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
              <div className="relative aspect-square md:aspect-auto md:h-full bg-zinc-50 min-h-[400px]">
                <Image
                  src={toy.imageSrc}
                  alt={toy.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
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