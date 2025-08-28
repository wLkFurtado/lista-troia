import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').regex(/^[\d\s\-\(\)\+]+$/, 'Formato de telefone inválido'),
});

type FormData = z.infer<typeof formSchema>;

export const VipForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    toast.success('Cadastro realizado com sucesso!');
    reset();
  };

  return (
    <section className="w-[560px] h-[310px] absolute -translate-x-2/4 z-[1] flex flex-col items-center justify-start bg-white px-[30px] py-[43px] rounded-[32px] left-2/4 top-[525px] max-md:w-[90%] max-md:max-w-[500px] max-md:h-[280px] max-md:px-5 max-md:py-[30px] max-md:top-[440px] max-sm:w-[95%] max-sm:h-[250px] max-sm:px-[15px] max-sm:py-[25px] max-sm:rounded-3xl max-sm:top-[340px]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
        <div className="w-full mb-6">
          <label
            htmlFor="name"
            className="text-black text-center text-[32px] font-bold leading-[44px] uppercase w-full block mb-3.5 max-md:text-2xl max-md:leading-8 max-md:mb-2.5 max-sm:text-xl max-sm:leading-7 max-sm:mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            QUAL SEU NOME?
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-[423px] h-[39px] bg-[#D9D9D9] rounded-lg px-4 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors max-md:w-full max-md:max-w-[380px] max-md:h-[35px] max-sm:w-full max-sm:h-8 max-sm:rounded-md"
            placeholder="Digite seu nome completo"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1 text-center" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="w-full mb-6">
          <label
            htmlFor="phone"
            className="text-black text-center text-[32px] font-bold leading-[44px] uppercase w-full block mb-3.5 max-md:text-2xl max-md:leading-8 max-md:mb-2.5 max-sm:text-xl max-sm:leading-7 max-sm:mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            QUAL SEU TELEFONE?
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-[423px] h-[39px] bg-[#D9D9D9] rounded-lg px-4 text-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-colors max-md:w-full max-md:max-w-[380px] max-md:h-[35px] max-sm:w-full max-sm:h-8 max-sm:rounded-md"
            placeholder="(11) 99999-9999"
            aria-describedby={errors.phone ? "phone-error" : undefined}
            aria-invalid={errors.phone ? "true" : "false"}
          />
          {errors.phone && (
            <p id="phone-error" className="text-red-500 text-sm mt-1 text-center" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 uppercase tracking-wide"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Entrar na Lista VIP
        </button>
      </form>
    </section>
  );
};
