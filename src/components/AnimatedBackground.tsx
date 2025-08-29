import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Neon gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 animate-pulse" 
           style={{ animationDuration: '3s' }} />
      
      {/* Moving neon streaks */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent 
                        animate-[slide-in-right_6s_ease-in-out_infinite] transform-gpu" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-400/20 to-transparent 
                        animate-[slide-in-right_8s_ease-in-out_infinite] transform-gpu" 
             style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Neon particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }, (_, i) => {
          const colors = ['bg-cyan-400', 'bg-pink-400', 'bg-purple-400', 'bg-green-400', 'bg-yellow-400'];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className={`absolute w-1 h-1 ${color} rounded-full shadow-lg animate-pulse`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                boxShadow: `0 0 10px currentColor`
              }}
            />
          );
        })}
      </div>
      
      {/* Glowing neon orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }, (_, i) => {
          const glowColors = [
            'shadow-cyan-400/50', 'shadow-pink-400/50', 'shadow-purple-400/50', 
            'shadow-green-400/50', 'shadow-yellow-400/50', 'shadow-blue-400/50'
          ];
          const bgColors = [
            'bg-cyan-400/10', 'bg-pink-400/10', 'bg-purple-400/10',
            'bg-green-400/10', 'bg-yellow-400/10', 'bg-blue-400/10'
          ];
          return (
            <div
              key={i}
              className={`absolute rounded-full ${bgColors[i % bgColors.length]} ${glowColors[i % glowColors.length]} 
                         blur-xl animate-[scale-in_4s_ease-in-out_infinite]`}
              style={{
                width: `${40 + Math.random() * 80}px`,
                height: `${40 + Math.random() * 80}px`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 4}s`,
                boxShadow: `0 0 30px currentColor`
              }}
            />
          );
        })}
      </div>
      
      {/* Neon light beams */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-cyan-400/40 via-transparent to-cyan-400/40 
                        animate-[fade-in_2s_ease-in-out_infinite] transform rotate-12 blur-sm" 
             style={{ animationDelay: '0.5s', boxShadow: '0 0 20px cyan' }} />
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-pink-400/40 via-transparent to-pink-400/40 
                        animate-[fade-in_2s_ease-in-out_infinite] transform -rotate-12 blur-sm" 
             style={{ animationDelay: '1.5s', boxShadow: '0 0 20px hotpink' }} />
        <div className="absolute top-0 left-2/3 w-1 h-full bg-gradient-to-b from-purple-400/40 via-transparent to-purple-400/40 
                        animate-[fade-in_2s_ease-in-out_infinite] transform rotate-6 blur-sm" 
             style={{ animationDelay: '1s', boxShadow: '0 0 20px purple' }} />
      </div>
      
      {/* Moving neon spotlight */}
      <div className="absolute inset-0">
        <div className="absolute w-80 h-80 rounded-full bg-gradient-radial from-cyan-400/10 to-transparent blur-3xl 
                        animate-[slide-in-right_10s_linear_infinite] opacity-60"
             style={{ 
               top: '30%',
               left: '-15%',
               transform: 'translateX(-100%)',
               boxShadow: '0 0 100px cyan'
             }} />
      </div>
    </div>
  );
};