import React, { useMemo } from 'react';
import nightclubImage from '@/assets/nightclub-silhouettes.jpg';

interface Particle {
  left: string;
  top: string;
  color: string;
  delay: string;
  duration: string;
}

interface Orb {
  width: string;
  height: string;
  left: string;
  top: string;
  color: string;
  delay: string;
}

const PARTICLE_COLORS = ['bg-cyan-400', 'bg-pink-400', 'bg-purple-400', 'bg-blue-400'];
const ORB_COLORS = ['bg-cyan-500/15', 'bg-pink-500/15', 'bg-purple-500/15', 'bg-blue-500/15'];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    delay: `${Math.random() * 4}s`,
    duration: `${2 + Math.random() * 3}s`,
  }));
}

function generateOrbs(count: number): Orb[] {
  return Array.from({ length: count }, (_, i) => ({
    width: `${80 + Math.random() * 120}px`,
    height: `${80 + Math.random() * 120}px`,
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 90}%`,
    color: ORB_COLORS[i % ORB_COLORS.length],
    delay: `${Math.random() * 6}s`,
  }));
}

export const AnimatedBackground: React.FC = () => {
  const particles = useMemo(() => generateParticles(20), []);
  const orbs = useMemo(() => generateOrbs(4), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Pure black background */}
      <div className="absolute inset-0 bg-black" />

      {/* Nightclub people image with low opacity */}
      <div className="absolute inset-0">
        <img
          src={nightclubImage}
          alt="People in nightclub"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Moving neon streaks */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent
                        animate-[slide-in-right_8s_ease-in-out_infinite] transform-gpu" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-500/25 to-transparent
                        animate-[slide-in-right_12s_ease-in-out_infinite] transform-gpu"
             style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent
                        animate-[slide-in-right_10s_ease-in-out_infinite] transform-gpu"
             style={{ animationDelay: '6s' }} />
      </div>

      {/* Neon particles - memoized positions */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 ${p.color} rounded-full animate-pulse opacity-60`}
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 8px currentColor'
            }}
          />
        ))}
      </div>

      {/* Glowing neon orbs - memoized positions */}
      <div className="absolute inset-0">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${orb.color}
                         blur-xl animate-[scale-in_6s_ease-in-out_infinite] opacity-70`}
            style={{
              width: orb.width,
              height: orb.height,
              left: orb.left,
              top: orb.top,
              animationDelay: orb.delay,
              filter: 'blur(20px)'
            }}
          />
        ))}
      </div>

      {/* Vertical neon light beams */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-cyan-500/40 via-cyan-500/10 to-cyan-500/40
                        animate-[fade-in_3s_ease-in-out_infinite] transform rotate-12 blur-sm opacity-80"
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-pink-500/35 via-pink-500/8 to-pink-500/35
                        animate-[fade-in_3s_ease-in-out_infinite] transform -rotate-12 blur-sm opacity-80"
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-0 left-2/3 w-1 h-full bg-gradient-to-b from-purple-500/30 via-purple-500/6 to-purple-500/30
                        animate-[fade-in_3s_ease-in-out_infinite] transform rotate-6 blur-sm opacity-80"
             style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Moving spotlight effect */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 rounded-full bg-gradient-radial from-cyan-500/15 to-transparent blur-3xl
                        animate-[slide-in-right_15s_linear_infinite] opacity-60"
             style={{
               top: '30%',
               left: '-20%',
               transform: 'translateX(-100%)'
             }} />
      </div>
    </div>
  );
};