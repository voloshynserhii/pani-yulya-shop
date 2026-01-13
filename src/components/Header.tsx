"use client";

import { useState } from "react";
import Link from "next/link";
import { MinusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: "Головна", href: "/" },
  { name: "Мої пісні", href: "/my-songs" },
  { name: "Відеопривітання", href: "/video" },
  { name: "Про Пані Юлю", href: "/about" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              KidsMusic
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                  {link.name}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
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
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
