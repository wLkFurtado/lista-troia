import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ children, className = "" }) => {
  return (
    <h1
      className={`w-[500px] text-center text-8xl font-extrabold leading-[124px] uppercase bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent absolute -translate-x-2/4 z-[1] h-[124px] left-2/4 top-[357px] max-md:text-7xl max-md:leading-[92px] max-md:w-[400px] max-md:top-[280px] max-sm:text-5xl max-sm:leading-[60px] max-sm:w-[300px] max-sm:top-[200px] ${className}`}
      style={{ 
        fontFamily: 'Inter, sans-serif',
        fontWeight: 900,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </h1>
  );
};
