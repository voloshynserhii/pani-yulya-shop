"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: "Головна", href: "/" },
  { name: "Відеопривітання", href: "/video" },
  { name: "Мої пісні", href: "/my-songs" },
  { name: "Про мене", href: "/about" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCount();
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <header className="w-full shadow-md fixed top-0 left-0 z-50 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center justify-center mt-2">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Pani Yulya Shop"
                width={150}
                height={10}
                className="h-auto w-auto cursor-pointer"
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-12">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="font-bold hover:text-sky-300">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 z-10">
            <Link href='/account' className="font-bold">
              <UserIcon className="h-6 w-6 hover:text-sky-300" />
            </Link>
            <Link href='/checkout' className="font-bold relative">
              <ShoppingCartIcon className="h-6 w-6 hover:text-sky-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="flex md:hidden gap-2 items-center">
            <div className="flex md:hidden items-center gap-3 z-10">
              <Link href='/account' className="font-bold">
                <UserIcon className="h-6 w-6" />
              </Link>

              <Link href='/checkout' className="font-bold relative">
                <ShoppingCartIcon className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="text-(--foreground) hover:text-blue-500 focus:outline-none"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div ref={menuRef} className="md:hidden shadow-md">
          <nav className="px-10 py-10 space-y-1">
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-xl font-bold block">
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
