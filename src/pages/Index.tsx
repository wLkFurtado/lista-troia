import React from 'react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Logo } from '@/components/Logo';
import { GradientText } from '@/components/GradientText';
import { VipForm } from '@/components/VipForm';

const Index = () => {
  return (
    <main className="relative w-screen min-h-screen overflow-hidden flex flex-col items-center bg-[#020202]">
      <AnimatedBackground />

      <div className="relative z-[1] flex flex-col items-center w-full px-4 py-10 gap-4 md:py-14 md:gap-6">
        <Logo
          src="https://api.builder.io/api/v1/image/assets/TEMP/12556187b358de88b421d0ac6400ce3914355c56?width=426"
          alt="Tróia Logo"
        />

        <GradientText>
          LISTA VIP
        </GradientText>

        <p
          className="max-w-[600px] text-white text-center text-sm font-bold uppercase sm:text-base md:text-xl md:leading-[44px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          FAVOR PREENCHER AS INFORMAÇÕES CORRETAMENTE
        </p>

        <VipForm />
      </div>
    </main>
  );
};

export default Index;
