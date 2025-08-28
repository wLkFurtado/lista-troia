import React from 'react';

interface BackgroundImageProps {
  src: string;
  alt?: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({ src, alt = "" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-[108%] h-[307.5%] absolute left-[-4.11%] top-[-130%] opacity-20 blur-[8.1px] object-cover z-0"
    />
  );
};
