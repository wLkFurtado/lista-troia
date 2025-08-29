import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark background with subtle neon hints */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 animate-pulse" 
           style={{ animationDuration: '6s' }} />
      
      {/* Very subtle moving neon streaks */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent 
                        animate-[slide-in-right_8s_ease-in-out_infinite] transform-gpu" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-400/15 to-transparent 
                        animate-[slide-in-right_12s_ease-in-out_infinite] transform-gpu" 
             style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Minimal neon particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => {
          const colors = ['bg-cyan-400/20', 'bg-pink-400/20', 'bg-purple-400/20'];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`absolute w-0.5 h-0.5 ${color} rounded-full animate-pulse opacity-30`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Very subtle glowing orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 3 }, (_, i) => {
          const bgColors = ['bg-cyan-400/5', 'bg-pink-400/5', 'bg-purple-400/5'];
          return (
            <div
              key={i}
              className={`absolute rounded-full ${bgColors[i % bgColors.length]} 
                         blur-2xl animate-[scale-in_8s_ease-in-out_infinite] opacity-40`}
              style={{
                width: `${60 + Math.random() * 100}px`,
                height: `${60 + Math.random() * 100}px`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 6}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Very subtle light beams */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-cyan-400/30 via-transparent to-cyan-400/30 
                        animate-[fade-in_4s_ease-in-out_infinite] transform rotate-12 blur-sm" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-pink-400/25 via-transparent to-pink-400/25 
                        animate-[fade-in_4s_ease-in-out_infinite] transform -rotate-12 blur-sm" 
             style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Minimal moving spotlight */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-60 h-60 rounded-full bg-gradient-radial from-cyan-400/10 to-transparent blur-3xl 
                        animate-[slide-in-right_15s_linear_infinite]"
             style={{ 
               top: '40%',
               left: '-10%',
               transform: 'translateX(-100%)'
             }} />
      </div>
    </div>
  );
};