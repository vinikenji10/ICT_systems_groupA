"use client";

import { useState } from "react";
import Image from "next/image";

interface FadeInImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}

export default function FadeInImage({ src, alt, fill = true, sizes, className = "", imageClassName = "" }: FadeInImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-100 flex items-center justify-center ${className}`}>
      {!isLoaded && <div className="absolute inset-0 bg-slate-100 animate-pulse" />}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        className={`transition-all duration-700 ease-in-out ${
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
        } ${imageClassName}`}
        unoptimized={true}
      />
    </div>
  );
}
