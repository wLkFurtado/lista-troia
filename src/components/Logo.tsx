import React from 'react';

interface LogoProps {
  src: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({ src, alt = "Logo" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-[120px] h-auto sm:w-40 md:w-[213px]"
    />
  );
};
