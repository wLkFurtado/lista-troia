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
      className="w-[213px] h-[247px] absolute -translate-x-2/4 z-[1] left-2/4 top-24 max-md:w-40 max-md:h-[185px] max-md:top-[60px] max-sm:w-[120px] max-sm:h-[139px] max-sm:top-10"
    />
  );
};
