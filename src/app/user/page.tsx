"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: 'Мій кошик',
  description: 'Переглядайте та керуйте товарами у вашому кошику перед оформленням замовлення.'
}

interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function UserPage() {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load basket from localStorage
    const savedBasket = localStorage.getItem("basket");
    if (savedBasket) {
      const items = JSON.parse(savedBasket);
      setBasket(items);
      calculateTotal(items);
    }
  }, []);

  const calculateTotal = (items: BasketItem[]) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const removeItem = (id: string) => {
    const updatedBasket = basket.filter((item) => item.id !== id);
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
    calculateTotal(updatedBasket);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updatedBasket = basket.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
    calculateTotal(updatedBasket);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8" style={{ color: "var(--foreground)" }}>Мій кошик</h1>

          {basket.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-(--foreground) text-lg mb-6">
                Ваш кошик порожній
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Продовжити покупки
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {basket.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center flex-1">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover rounded mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                            {item.name}
                          </h3>
                          <p className="text-(--foreground)">
                            {item.price.toFixed(2)} грн
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mr-4">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-gray-200 text-(--foreground) rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-200 text-(--foreground) rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded transition"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>
                    Итого
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-(--foreground)">
                      <span>Підсумок:</span>
                      <span>{total.toFixed(2)} грн</span>
                    </div>
                    <div className="flex justify-between text-(--foreground)">
                      <span>Доставка:</span>
                      <span>Розраховується</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold" style={{ color: "var(--foreground)" }}>
                      <span>Всього:</span>
                      <span>{total.toFixed(2)} грн</span>
                    </div>
                  </div>
                  <button className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300">
                    Оформити замовлення
                  </button>
                  <Link
                    href="/"
                    className="block text-center mt-3 px-6 py-3 bg-gray-200 font-semibold rounded-lg hover:bg-gray-300 transition duration-300" style={{ color: "var(--foreground)" }}
                  >
                    Продовжити покупки
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
