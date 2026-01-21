"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface HeroProps {
  imageSrc: string;
  imageAlt: string;
  title: ReactNode;
  description: ReactNode;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: "left" | "right";
}

export const Hero = ({
  imageSrc,
  imageAlt,
  title,
  description,
/*   buttonText,
  buttonLink, */
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
      <h1 className="text-5xl md:text-7xl font-bold mb-15 whitespace-pre-line" style={{ color: "var(--foreground)" }}>
        {title}
      </h1>
      <p className="text-2xl text-(--foreground) mb-8 leading-relaxed font-semibold">
        {description}
      </p>
{/*       {buttonText && buttonLink && (
        <div>
          <Link
            href={buttonLink}
            className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {buttonText}
          </Link>
        </div>
      )} */}
    </div>
  );

  return (
    <div className="w-full" style={{ backgroundColor: "var(--primary)" }}>
      <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center px-[30px] py-[40px]"> 
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
    </div>
  );
};
