"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface HeroProps {
  imageSrc: string;
  imageAlt: string;
  title: ReactNode;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: "left" | "right";
}

export const Hero = ({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonText,
  buttonLink,
  imagePosition = "left",
}: HeroProps) => {
  const imageContent = (
    <div className="w-full md:w-1/2 flex items-center justify-center">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={600}
        height={500}
        className="w-full h-auto object-cover rounded-lg"
      />
    </div>
  );

  const textContent = (
    <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 whitespace-pre-line" style={{ color: "var(--foreground)" }}>
        {title}
      </h1>
      <p className="text-lg text-(--foreground) mb-8 leading-relaxed font-semibold">
        {description}
      </p>
      {buttonText && buttonLink && (
        <div>
          <Link
            href={buttonLink}
            className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {buttonText}
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full items-center py-[30px]" style={{ backgroundColor: "var(--primary)" }}>
      {imagePosition === "left" ? (
        <>
          {imageContent}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {imageContent}
        </>
      )}
    </div>
  );
};
