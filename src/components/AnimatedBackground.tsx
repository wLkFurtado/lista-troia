import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 animate-pulse" 
           style={{ animationDuration: '4s' }} />
      
      {/* Moving gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent 
                        animate-[slide-in-right_8s_ease-in-out_infinite] transform-gpu" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-gold rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Large floating orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-brand-gold/5 to-transparent blur-xl 
                       animate-[scale-in_6s_ease-in-out_infinite]"
            style={{
              width: `${60 + Math.random() * 120}px`,
              height: `${60 + Math.random() * 120}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
      
      {/* Pulsing light beams */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-brand-gold/20 via-transparent to-brand-gold/20 
                        animate-[fade-in_3s_ease-in-out_infinite] transform rotate-12" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-brand-gold/15 via-transparent to-brand-gold/15 
                        animate-[fade-in_3s_ease-in-out_infinite] transform -rotate-12" 
             style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Subtle moving spotlight */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl 
                        animate-[slide-in-right_12s_linear_infinite] opacity-50"
             style={{ 
               top: '20%',
               left: '-10%',
               transform: 'translateX(-100%)'
             }} />
      </div>
    </div>
  );
};