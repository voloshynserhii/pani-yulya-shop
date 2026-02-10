"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { Toy } from "@/data/toys";

export default function ToyCard({ toy }: { toy: Toy }) {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.some((item: any) => item.id === toy.id);
    setIsInCart(exists);
  }, [toy.id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const item = {
      trackId: toy.id, // Using trackId for compatibility with existing checkout logic
      id: toy.id,
      title: toy.title,
      coverSrc: toy.imageSrc,
      price: toy.price,
      type: 'toy'
    };

    if (!cart.some((i: any) => i.id === toy.id)) {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group bg-white border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/shop/${toy.id}`} className="block flex-grow flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-zinc-50">
          <Image
            src={toy.imageSrc}
            alt={toy.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5 pb-0 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-zinc-900 group-hover:text-blue-600 transition-colors">{toy.title}</h3>
            <div className="flex items-center gap-1 text-yellow-500 shrink-0 bg-yellow-50 px-2 py-1 rounded-md">
              <span className="text-xs">★</span>
              <span className="text-xs font-bold text-zinc-700">{toy.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">
            {toy.description}
          </p>
        </div>
      </Link>
      
      <div className="p-5 pt-4 mt-auto">
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <span className="font-bold text-xl text-zinc-900">{toy.price} грн</span>
          <Button 
            size="icon" 
            /* onClick={addToCart}  */
            disabled={isInCart} 
            variant={isInCart ? "secondary" : "default"}
            className="shrink-0 transition-all rounded-full h-10 w-10"
            aria-label={isInCart ? "В кошику" : "Додати в кошик"}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
