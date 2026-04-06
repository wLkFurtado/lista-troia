import React from 'react';

interface LogoProps {
  src: string;
  alt?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ src, alt = "Logo", className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className || "w-[120px] h-auto sm:w-40 md:w-[213px]"}
    />
  );
};
