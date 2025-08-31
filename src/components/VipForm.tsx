
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useUTM } from '@/hooks/useUTM';
import type { Lead } from '@/types/lead';
import { addLead } from '@/utils/storage';
import { ThankYouMessage } from '@/components/ThankYouMessage';
import { insertLeadSupabase } from '@/integrations/supabase/leads';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Formato de telefone inválido'),
});

type FormData = z.infer<typeof formSchema>;

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

export const VipForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const utm = useUTM();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const now = new Date();
    const payload: Lead = {
      id: uid(),
      nome_completo: data.name.trim(),
      telefone: data.phone.trim(),
      fonte_lead: utm.fonte_lead,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      data_cadastro: now.toISOString(),
      status: 'aguardando',
      data_entrada: null,
    };

    // 1) Mantém o comportamento atual (armazenamento local para o Painel)
    addLead<Lead>(payload);

    // 2) Também envia para o Supabase (ID gerado pelo banco)
    try {
      const { error } = await insertLeadSupabase({
        nome_completo: payload.nome_completo,
        telefone: payload.telefone,
        fonte_lead: payload.fonte_lead,
        utm_source: payload.utm_source,
        utm_medium: payload.utm_medium,
        utm_campaign: payload.utm_campaign,
        data_cadastro: payload.data_cadastro,
        status: payload.status,
        data_entrada: payload.data_entrada,
      });

      if (error) {
        console.error('[Supabase] Falha ao inserir lead:', error);
        toast.error('Não foi possível salvar no banco. Tente novamente.');
        return;
      }
    } catch (err) {
      console.error('[Supabase] Erro inesperado ao inserir lead:', err);
      toast.error('Erro inesperado ao salvar no banco. Tente novamente.');
      return;
    }

    toast.success('Cadastro realizado com sucesso!');
    setSubmitted(true);
    reset();
  };

  return (
    <section className="w-[560px] h-[310px] absolute -translate-x-2/4 z-[1] flex flex-col items-center justify-start bg-white px-[30px] py-[43px] rounded-[32px] left-2/4 top-[525px] max-md:w-[90%] max-md:max-w-[500px] max-md:h-[280px] max-md:px-5 max-md:py-[30px] max-md:top-[440px] max-sm:w-[95%] max-sm:h-[250px] max-sm:px-[15px] max-sm:py-[25px] max-sm:rounded-3xl max-sm:top-[340px]">
      {submitted ? (
        <ThankYouMessage />
      ) : (
        <form id="form-container" onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
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
              className="w-full max-w-[420px] h-[42px] bg-[#D9D9D9] rounded-lg px-4 text-black text-center focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all duration-300 mx-auto block font-medium max-md:h-[38px] max-sm:h-[36px] max-sm:text-sm"
              placeholder="Digite seu nome completo"
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
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
              className="w-full max-w-[420px] h-[42px] bg-[#D9D9D9] rounded-lg px-4 text-black text-center focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all duration-300 mx-auto block font-medium max-md:h-[38px] max-sm:h-[36px] max-sm:text-sm"
              placeholder="(11) 99999-9999"
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-500 text-sm mt-1 text-center" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-brand-success to-brand-success2 text-white font-bold py-3.5 px-10 rounded-lg hover:brightness-110 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-success focus:ring-offset-2 uppercase tracking-wide text-lg max-md:py-3 max-md:px-8 max-md:text-base max-sm:py-2.5 max-sm:px-6 max-sm:text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Entrar na Lista VIP
          </button>
        </form>
      )}
    </section>
  );
};
