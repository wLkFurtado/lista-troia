import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ children, className = "" }) => {
  return (
    <h1
      className={`text-center text-5xl font-extrabold uppercase bg-gradient-to-r from-brand-gold-light via-brand-gold to-brand-gold-dark bg-clip-text text-transparent sm:text-7xl md:text-8xl ${className}`}
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
