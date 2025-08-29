import React from 'react';
import { BackgroundImage } from '@/components/BackgroundImage';
import { Logo } from '@/components/Logo';
import { GradientText } from '@/components/GradientText';
import { VipForm } from '@/components/VipForm';

const Index = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <main className="max-w-none w-screen h-screen relative overflow-hidden flex flex-col items-center justify-start bg-[#020202] mx-auto p-4 md:p-6 lg:p-8 xl:p-10">
        <BackgroundImage 
          src="https://api.builder.io/api/v1/image/assets/TEMP/2034ed27cb1fcc6952857351b08f578ffe5590a4?width=4156"
          alt="Background pattern"
        />
        
        <Logo 
          src="https://api.builder.io/api/v1/image/assets/TEMP/12556187b358de88b421d0ac6400ce3914355c56?width=426"
          alt="Tróia Logo"
        />
        
        <GradientText>
          LISTA VIP
        </GradientText>
        
        <p className="w-[1159px] text-white text-center text-xl font-bold leading-[44px] uppercase absolute -translate-x-2/4 z-[1] h-11 left-2/4 top-[467px] max-md:text-base max-md:leading-9 max-md:w-[90%] max-md:top-[380px] max-sm:text-sm max-sm:leading-7 max-sm:w-[95%] max-sm:top-[280px]"
           style={{ fontFamily: 'Inter, sans-serif' }}>
          FAVOR PREENCHER AS INFORMAÇÕES CORRETAMENTE
        </p>
        
        <VipForm />
      </main>
    </>
  );
};

export default Index;
