"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: "Головна", href: "/" },
  { name: "Відеопривітання", href: "/video" },
  { name: "Мої пісні", href: "/my-songs" },
  { name: "Про мене", href: "/about" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full shadow-md fixed top-0 left-0 z-50" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Pani Yulya Shop"
                width={120}
                height={50}
                className="h-auto w-auto cursor-pointer"
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="font-bold">
                  {link.name}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-(--foreground) hover:text-blue-500 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <MinusIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="font-bold block">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
