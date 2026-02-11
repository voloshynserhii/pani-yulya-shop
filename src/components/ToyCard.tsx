"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { Toy } from "@/data/toys";

interface CartItem extends Toy {
    type?: 'toy' | 'music_track'
    toyId?: string
}

export default function ToyCard({ toy }: { toy: Toy }) {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.some((item: CartItem) => item.toyId === toy._id);
    setIsInCart(exists);
  }, [toy._id]);

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
    <Card className="overflow-hidden flex flex-col h-full group bg-white border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/shop/${toy._id}`} className="block flex-grow flex flex-col">
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
            onClick={addToCart} 
            disabled={isInCart} 
            className="w-full sm:w-auto px-5 h-12 text-md rounded-full"
            aria-label={isInCart ? "В кошику" : "Додати в кошик"}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
