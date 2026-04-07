
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useUTM } from '@/hooks/useUTM';
import type { ListaTipo } from '@/types/lead';
import { insertListaComConvidados, checkDuplicatePhone } from '@/integrations/supabase/leads';
import { X, Plus, PartyPopper, Cake, ArrowLeft, Loader2, CalendarDays, Crown, CheckCircle2, ChevronRight, Check } from 'lucide-react';

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

type Step = 'tipo' | 'data' | 'responsavel' | 'convidados' | 'sucesso';
type InputMode = 'individual' | 'colar';

const STEP_ORDER: Step[] = ['tipo', 'data', 'responsavel', 'convidados'];
const STEP_LABELS = ['Tipo', 'Data', 'Dados', 'Lista'];

function StepProgress({ currentStep }: { currentStep: Step }) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  if (currentIndex === -1) return null; // sucesso step

  return (
    <div className="w-full max-w-[420px] mx-auto mb-6 flex items-center justify-between gap-1">
      {STEP_ORDER.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              isDone
                ? 'bg-brand-gold text-black'
                : isCurrent
                  ? 'border-2 border-brand-gold text-brand-gold bg-transparent'
                  : 'border border-[#333] text-[#555] bg-transparent'
            }`}>
              {isDone ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isDone ? 'text-brand-gold' : isCurrent ? 'text-brand-gold/80' : 'text-[#555]'
            }`}>{STEP_LABELS[i]}</span>
            {i < STEP_ORDER.length - 1 && (
              <div className={`absolute`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export const VipForm: React.FC = () => {
  const [step, setStep] = useState<Step>('tipo');
  const [tipo, setTipo] = useState<ListaTipo>('convencional');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [convidados, setConvidados] = useState<string[]>([]);
  const [novoConvidado, setNovoConvidado] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nomeError, setNomeError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [dataEvento, setDataEvento] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('individual');
  const [textoColar, setTextoColar] = useState('');
  const utm = useUTM();

  const tipoLabel = tipo === 'aniversario' ? 'Aniversariante' : 'Responsável';

  const handleSelectTipo = (t: ListaTipo) => {
    setTipo(t);
    setStep('data');
  };

  const getAvailableDates = () => {
    const dates: Date[] = [];
    const now = new Date();
    const allowedDays = [1, 5, 6];

    for (let i = 0; i < 14; i++) {
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + i);
      candidate.setHours(0, 0, 0, 0);
      const dayOfWeek = candidate.getDay();
      if (allowedDays.includes(dayOfWeek)) {
        if (i === 0) {
          if (now.getHours() < 21) dates.push(candidate);
        } else {
          dates.push(candidate);
        }
      }
      if (dates.length >= 4) break;
    }
    return dates;
  };

  const formatDateLabel = (d: Date) => {
    const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const diaNum = d.getDate().toString().padStart(2, '0');
    const mesNum = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${dias[d.getDay()]}, ${diaNum}/${mesNum}`;
  };

  const toISODate = (d: Date) => {
    const ano = d.getFullYear();
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const dia = d.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const handleDataNext = (isoDate: string) => {
    setDataEvento(isoDate);
    setStep('responsavel');
  };

  const handleResponsavelNext = () => {
    let valid = true;
    setNomeError('');
    setTelefoneError('');

    if (nome.trim().length < 2) {
      setNomeError('O nome deve ter pelo menos 2 caracteres');
      valid = false;
    }
    const digits = telefone.replace(/\D/g, '');
    if (digits.length < 10) {
      setTelefoneError('O telefone deve ter pelo menos 10 dígitos');
      valid = false;
    }
    if (valid) {
      setStep('convidados');
    }
  };

  const handleAddConvidado = () => {
    const name = novoConvidado.trim();
    if (name.length < 2) {
      toast.error('Nome do convidado deve ter pelo menos 2 caracteres', { style: { background: '#111', color: '#fff', border: '1px solid #333' } });
      return;
    }
    // Duplicate detection
    if (convidados.some(c => c.toLowerCase() === name.toLowerCase())) {
      toast.warning('Este convidado já está na lista!', { style: { background: '#202020', color: '#DAA520', border: '1px solid #DAA520' } });
      return;
    }
    setConvidados([...convidados, name]);
    setNovoConvidado('');
  };

  const handleRemoveConvidado = (index: number) => {
    setConvidados(convidados.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddConvidado();
    }
  };

  const handleColarNomes = () => {
    const nomes = textoColar
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length >= 2);
    if (nomes.length === 0) {
      toast.error('Nenhum nome válido encontrado. Coloque um nome por linha.', { style: { background: '#111', color: '#fff', border: '1px solid #333' } });
      return;
    }
    // Filter duplicates from paste
    const existing = new Set(convidados.map(c => c.toLowerCase()));
    const uniqueNomes = nomes.filter(n => !existing.has(n.toLowerCase()));
    const dupes = nomes.length - uniqueNomes.length;
    
    setConvidados([...convidados, ...uniqueNomes]);
    setTextoColar('');
    setInputMode('individual');
    
    let msg = `${uniqueNomes.length} nome${uniqueNomes.length > 1 ? 's' : ''} adicionado${uniqueNomes.length > 1 ? 's' : ''}!`;
    if (dupes > 0) msg += ` (${dupes} duplicado${dupes > 1 ? 's' : ''} ignorado${dupes > 1 ? 's' : ''})`;
    toast.success(msg, { style: { background: '#202020', color: '#DAA520', border: '1px solid #DAA520' } });
  };

  const handleSubmit = async () => {
    if (convidados.length === 0) return;
    setIsLoading(true);
    try {
      const rawPhone = telefone.replace(/\D/g, '');
      const { isDuplicate } = await checkDuplicatePhone(rawPhone);
      if (isDuplicate) {
        toast.error('Este telefone já possui uma lista cadastrada!', { style: { background: '#111', color: '#fff', border: '1px solid #333' } });
        setIsLoading(false);
        return;
      }

      const { error } = await insertListaComConvidados(
        {
          tipo,
          nome_responsavel: nome.trim(),
          telefone: rawPhone,
          fonte_lead: utm.fonte_lead,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          data_evento: dataEvento,
        },
        convidados
      );

      if (error) {
        toast.error('Erro ao salvar a lista. Tente novamente.', { style: { background: '#111', color: '#fff', border: '1px solid #333' } });
        return;
      }

      toast.success('Lista criada com sucesso!', { style: { background: '#202020', color: '#DAA520', border: '1px solid #DAA520' } });
      setStep('sucesso');
    } catch {
      toast.error('Erro inesperado. Tente novamente.', { style: { background: '#111', color: '#fff', border: '1px solid #333' } });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full max-w-[420px] h-[52px] bg-[#111111] border border-[#2A2A2A] rounded-xl px-5 text-white text-base focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all duration-300 mx-auto block font-medium placeholder-gray-500 shadow-inner";

  const canFinalize = convidados.length > 0;

  return (
    <section className="w-[95%] max-w-[560px] bg-[#050505]/90 backdrop-blur-xl border border-[#222] shadow-[0_0_50px_rgba(218,165,32,0.07)] px-5 py-8 rounded-[32px] sm:px-8 sm:py-10 md:px-[40px] md:py-[48px] relative overflow-hidden">
      
      {/* Decorative Brand Gradients */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-gold opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-brand-gold opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

      {/* Step Progress */}
      {step !== 'sucesso' && <StepProgress currentStep={step} />}

      {/* ========== STEP: TIPO ========== */}
      {step === 'tipo' && (
        <div className="flex flex-col items-center gap-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col gap-2 items-center mb-2">
            <h2 className="text-white text-center text-2xl sm:text-[28px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
              Selecione o <span className="text-brand-gold">Tipo</span>
            </h2>
            <p className="text-gray-400 text-center text-sm">Escolha o formato da sua lista premium</p>
          </div>

          <button
            onClick={() => handleSelectTipo('aniversario')}
            className="group w-full max-w-[400px] flex items-center justify-between bg-gradient-to-br from-[#121212] to-[#181818] border border-[#2A2A2A] hover:border-brand-gold text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 text-base sm:text-lg uppercase tracking-wide cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.15)]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#222] group-hover:border-brand-gold/30 group-hover:text-brand-gold transition-colors duration-300">
                <Cake size={22} />
              </div>
              <span>Aniversário</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#333] group-hover:border-brand-gold/50 flex items-center justify-center transition-colors">
              <ChevronRight size={18} className="text-gray-500 group-hover:text-brand-gold transition-colors" />
            </div>
          </button>

          <button
            onClick={() => handleSelectTipo('convencional')}
            className="group w-full max-w-[400px] flex items-center justify-between bg-gradient-to-br from-[#121212] to-[#181818] border border-[#2A2A2A] hover:border-brand-gold text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 text-base sm:text-lg uppercase tracking-wide cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.15)]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#222] group-hover:border-brand-gold/30 group-hover:text-brand-gold transition-colors duration-300">
                <PartyPopper size={22} />
              </div>
              <span>Convencional</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#333] group-hover:border-brand-gold/50 flex items-center justify-center transition-colors">
              <ChevronRight size={18} className="text-gray-500 group-hover:text-brand-gold transition-colors" />
            </div>
          </button>
        </div>
      )}

      {/* ========== STEP: DATA DO EVENTO ========== */}
      {step === 'data' && (
        <div className="flex flex-col items-center gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <button
            onClick={() => setStep('tipo')}
            className="self-start flex items-center gap-2 text-sm text-gray-400 hover:text-brand-gold transition-colors font-medium mb-2"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="flex flex-col gap-2 items-center mb-2">
            <h2 className="text-white text-center text-2xl sm:text-[28px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
              Escolha a <span className="text-brand-gold">Data</span>
            </h2>
            <p className="text-gray-400 text-center text-sm max-w-[340px]">
              Nossas listas são válidas para Segunda, Sexta e Sábado. No próprio dia da festa, encerramos a lista às 21h00.
            </p>
          </div>

          <div className="w-full max-w-[400px] flex flex-col gap-3 mt-2">
            {getAvailableDates().map((dataOption) => (
              <button
                key={dataOption.getTime()}
                onClick={() => handleDataNext(toISODate(dataOption))}
                className="group w-full flex items-center gap-4 bg-[#111111] border border-[#2A2A2A] hover:border-brand-gold hover:bg-[#151515] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(218,165,32,0.1)]"
              >
                <CalendarDays size={20} className="text-gray-500 group-hover:text-brand-gold transition-colors" />
                <span className="text-left flex-1 tracking-wide">{formatDateLabel(dataOption)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========== STEP: RESPONSÁVEL ========== */}
      {step === 'responsavel' && (
        <div className="flex flex-col items-center gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <button
            onClick={() => setStep('data')}
            className="self-start flex items-center gap-2 text-sm text-gray-400 hover:text-brand-gold transition-colors font-medium"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="flex flex-col gap-2 items-center mb-2">
            <div className="p-3 bg-[#111] rounded-full border border-[#2A2A2A] mb-1">
               <Crown size={24} className="text-brand-gold" />
            </div>
            <h2 className="text-white text-center text-xl sm:text-2xl font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
               <span className="text-brand-gold">Dados</span> Pessoais
            </h2>
            <p className="text-gray-400 text-center text-sm">Insira os dados do {tipoLabel.toLowerCase()} para prosseguir</p>
          </div>

          <div className="w-full max-w-[420px] space-y-5">
            <div className="space-y-2">
              <label className="text-gray-300 text-xs font-bold uppercase tracking-wider ml-1">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={`${inputClass} pl-4`}
                placeholder="Seu nome completo"
              />
              {nomeError && <p className="text-red-400 text-xs mt-1 ml-1">{nomeError}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-xs font-bold uppercase tracking-wider ml-1">WhatsApp</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(applyPhoneMask(e.target.value))}
                className={`${inputClass} pl-4`}
                placeholder="(11) 99999-9999"
              />
              {telefoneError && <p className="text-red-400 text-xs mt-1 ml-1">{telefoneError}</p>}
            </div>
          </div>

          <button
            onClick={handleResponsavelNext}
            className="w-full max-w-[420px] mt-4 bg-brand-gold text-black font-bold py-4 rounded-xl hover:bg-white transition-all duration-300 uppercase tracking-widest text-sm sm:text-base border border-transparent hover:border-brand-gold shadow-[0_0_20px_rgba(218,165,32,0.2)]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Continuar
          </button>
        </div>
      )}

      {/* ========== STEP: CONVIDADOS ========== */}
      {step === 'convidados' && (
        <div className="flex flex-col items-center gap-5 relative z-10 animate-in fade-in zoom-in-95 duration-500 w-full">
          <button
            onClick={() => setStep('responsavel')}
            className="self-start flex items-center gap-2 text-sm text-gray-400 hover:text-brand-gold transition-colors font-medium"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="flex flex-col gap-1 items-center mb-2 w-full">
            <h2 className="text-white text-center text-xl sm:text-2xl font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
               Lista de <span className="text-brand-gold">Convidados</span>
            </h2>
            <p className="text-gray-400 text-sm text-center">
              Adicionando para <strong>{nome.split(' ')[0]}</strong>
            </p>
          </div>

          {/* Lista de convidados adicionados */}
          {convidados.length > 0 && (
            <div className="w-full max-w-[420px] flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Adicionados ({convidados.length})</span>
              </div>
              <div className="w-full max-h-[160px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {convidados.map((c, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#111] border border-[#222] rounded-lg px-4 py-3 group hover:border-[#333] transition-colors">
                    <span className="text-gray-200 text-sm font-medium">{c}</span>
                    <button
                      onClick={() => handleRemoveConvidado(i)}
                      className="text-[#555] hover:text-red-400 transition-colors"
                      aria-label={`Remover ${c}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toggle entre modos */}
          <div className="w-full max-w-[420px] flex justify-end">
            <button
              type="button"
              onClick={() => setInputMode(inputMode === 'individual' ? 'colar' : 'individual')}
              className="text-xs text-brand-gold/80 hover:text-brand-gold transition-colors font-medium flex items-center gap-1 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-[#2A2A2A]"
            >
              {inputMode === 'individual' ? '📋 Colar lista completa' : '✏️ Adicionar um por um'}
            </button>
          </div>

          {inputMode === 'individual' ? (
            <div className="w-full flex gap-3 max-w-[420px] mx-auto mt-1">
              <input
                type="text"
                value={novoConvidado}
                onChange={(e) => setNovoConvidado(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-[48px] bg-[#111] border border-[#2A2A2A] rounded-xl px-4 text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
                placeholder="Nome do convidado"
              />
              <button
                onClick={handleAddConvidado}
                className="h-[48px] px-5 bg-[#1A1A1A] border border-[#333] hover:border-brand-gold hover:text-brand-gold text-white rounded-xl transition-all font-bold flex items-center justify-center"
                type="button"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <div className="w-full max-w-[420px] mx-auto flex flex-col gap-3 mt-1">
              <textarea
                value={textoColar}
                onChange={(e) => setTextoColar(e.target.value)}
                className="w-full h-[120px] bg-[#111] border border-[#2A2A2A] rounded-xl p-4 text-white text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all resize-none shadow-inner custom-scrollbar"
                placeholder={"Cole os nomes aqui, um por linha.\nEx:\nJoão Silva\nMaria Santos\nPedro Oliveira"}
              />
              <button
                type="button"
                onClick={handleColarNomes}
                className="w-full bg-[#1A1A1A] border border-[#333] text-gray-200 font-bold py-3 px-5 rounded-xl hover:border-brand-gold hover:text-brand-gold transition-all text-sm uppercase tracking-wider"
              >
                Processar Nomes
              </button>
            </div>
          )}

          {/* Botão finalizar */}
          <div className="w-full max-w-[420px] mt-4 pt-4 border-t border-[#222]">
            {!canFinalize && (
              <p className="text-center text-xs text-zinc-500 mb-3">Adicione pelo menos 1 convidado para finalizar</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !canFinalize}
              className="w-full bg-brand-gold text-black font-bold py-4 rounded-xl hover:bg-white transition-all duration-300 uppercase tracking-widest text-sm sm:text-base border border-transparent shadow-[0_0_20px_rgba(218,165,32,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Enviando...
                </>
              ) : (
                `Finalizar Lista (${convidados.length} convidado${convidados.length !== 1 ? 's' : ''})`
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========== STEP: SUCESSO ========== */}
      {step === 'sucesso' && (
        <div className="flex flex-col items-center gap-6 text-center py-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full" />
            <CheckCircle2 size={80} className="text-brand-gold relative z-10" strokeWidth={1.5} />
          </div>
          
          <div className="space-y-2 mt-4">
            <h2 className="text-brand-gold text-2xl sm:text-3xl font-bold uppercase tracking-widest">Sucesso!</h2>
            <p className="text-white text-base sm:text-lg leading-relaxed font-light">
              Tudo pronto para <strong>{nome}</strong>
            </p>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-[340px] p-5 space-y-3 shadow-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Tipo</span>
              <span className="text-white font-medium">{tipo === 'aniversario' ? 'Aniversário' : 'Convencional'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Data</span>
              <span className="text-white font-medium">{dataEvento.split('-').reverse().join('/')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Convidados</span>
              <span className="text-white font-medium">{convidados.length} pessoa(s)</span>
            </div>
          </div>

          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2 border border-[#222] px-4 py-2 rounded-full">
            Aguarde nosso contato
          </p>
        </div>
      )}
    </section>
  );
};
