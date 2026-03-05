
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useUTM } from '@/hooks/useUTM';
import type { ListaTipo } from '@/types/lead';
import { insertListaComConvidados, checkDuplicatePhone } from '@/integrations/supabase/leads';
import { X, Plus, PartyPopper, Cake, ArrowLeft, Loader2 } from 'lucide-react';

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
    
    // 1 = Segunda, 5 = Sexta, 6 = Sábado
    const allowedDays = [1, 5, 6];

    for (let i = 0; i < 14; i++) {
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + i);
      candidate.setHours(0, 0, 0, 0); 
      
      const dayOfWeek = candidate.getDay(); 
      
      if (allowedDays.includes(dayOfWeek)) {
        if (i === 0) {
          const currentHour = now.getHours();
          // Até 21:00 inclusive (21:00-21:59 => 21. Se for < 21, então até 20:59. Ajustando para <= 20 pra travar às 21:00.)
          if (currentHour < 21) {
            dates.push(candidate);
          }
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
      setNomeError('Nome deve ter pelo menos 2 caracteres');
      valid = false;
    }
    const digits = telefone.replace(/\D/g, '');
    if (digits.length < 10) {
      setTelefoneError('Telefone deve ter pelo menos 10 dígitos');
      valid = false;
    }
    if (valid) {
      setStep('convidados');
    }
  };

  const handleAddConvidado = () => {
    const name = novoConvidado.trim();
    if (name.length < 2) {
      toast.error('Nome do convidado deve ter pelo menos 2 caracteres');
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
      toast.error('Nenhum nome válido encontrado. Coloque um nome por linha.');
      return;
    }
    setConvidados([...convidados, ...nomes]);
    setTextoColar('');
    setInputMode('individual');
    toast.success(`${nomes.length} nome${nomes.length > 1 ? 's' : ''} adicionado${nomes.length > 1 ? 's' : ''}!`);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const rawPhone = telefone.replace(/\D/g, '');
      const { isDuplicate } = await checkDuplicatePhone(rawPhone);
      if (isDuplicate) {
        toast.error('Este telefone já possui uma lista cadastrada!');
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
        toast.error('Erro ao salvar a lista. Tente novamente.');
        return;
      }

      toast.success('Lista criada com sucesso!');
      setStep('sucesso');
    } catch {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full max-w-[420px] h-[42px] bg-[#D9D9D9] rounded-lg px-4 text-black text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all duration-300 mx-auto block font-medium";

  return (
    <section className="w-[95%] max-w-[560px] bg-white px-4 py-6 rounded-3xl sm:px-6 sm:py-8 md:px-[30px] md:py-[43px] md:rounded-[32px]">
      {/* ========== STEP: TIPO ========== */}
      {step === 'tipo' && (
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-black text-center text-xl sm:text-2xl md:text-[28px] font-bold uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            Escolha o tipo da lista
          </h2>
          <button
            onClick={() => handleSelectTipo('aniversario')}
            className="w-full max-w-[400px] flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-4 px-6 rounded-xl hover:brightness-110 transition-all duration-300 transform hover:scale-[1.02] text-base sm:text-lg uppercase tracking-wide"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Cake size={24} />
            Lista Aniversário
          </button>
          <button
            onClick={() => handleSelectTipo('convencional')}
            className="w-full max-w-[400px] flex items-center justify-center gap-3 bg-gradient-to-r from-brand-success to-brand-success2 text-white font-bold py-4 px-6 rounded-xl hover:brightness-110 transition-all duration-300 transform hover:scale-[1.02] text-base sm:text-lg uppercase tracking-wide"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <PartyPopper size={24} />
            Lista Convencional
          </button>
        </div>
      )}

      {/* ========== STEP: DATA DO EVENTO ========== */}
      {step === 'data' && (
        <div className="flex flex-col items-center gap-5">
          <button
            onClick={() => setStep('tipo')}
            className="self-start flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <h2 className="text-black text-center text-xl sm:text-2xl md:text-[28px] font-bold uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            Para quando é a lista?
          </h2>
          <p className="text-gray-500 text-center text-sm md:text-base mb-2">
            Nossas listas são válidas para Segunda, Sexta e Sábado. No próprio dia da festa, encerramos a lista às 21h00.
          </p>

          <div className="w-full max-w-[400px] flex flex-col gap-3">
            {getAvailableDates().map((dataOption) => (
              <button
                key={dataOption.getTime()}
                onClick={() => handleDataNext(toISODate(dataOption))}
                className="w-full bg-[#D9D9D9] hover:bg-brand-gold hover:text-white text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-sm border border-transparent hover:border-brand-gold"
              >
                {formatDateLabel(dataOption)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========== STEP: RESPONSÁVEL ========== */}
      {step === 'responsavel' && (
        <div className="flex flex-col items-center gap-4 md:gap-5">
          <button
            onClick={() => setStep('data')}
            className="self-start flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <h2 className="text-black text-center text-lg sm:text-xl md:text-2xl font-bold uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {tipo === 'aniversario' ? '🎂 Nome do Aniversariante' : '🎉 Nome do Responsável'}
          </h2>

          <div className="w-full">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
              placeholder={`Nome do ${tipoLabel.toLowerCase()}`}
            />
            {nomeError && <p className="text-red-500 text-sm mt-1 text-center">{nomeError}</p>}
          </div>

          <h2 className="text-black text-center text-lg sm:text-xl md:text-2xl font-bold uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            Telefone
          </h2>

          <div className="w-full">
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(applyPhoneMask(e.target.value))}
              className={inputClass}
              placeholder="(11) 99999-9999"
            />
            {telefoneError && <p className="text-red-500 text-sm mt-1 text-center">{telefoneError}</p>}
          </div>

          <button
            onClick={handleResponsavelNext}
            className="bg-gradient-to-r from-brand-success to-brand-success2 text-white font-bold py-3 px-8 rounded-lg hover:brightness-110 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide text-sm sm:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Próximo →
          </button>
        </div>
      )}

      {/* ========== STEP: CONVIDADOS ========== */}
      {step === 'convidados' && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setStep('responsavel')}
            className="self-start flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <h2 className="text-black text-center text-lg sm:text-xl md:text-2xl font-bold uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            Adicionar Convidados
          </h2>

          <p className="text-gray-500 text-sm text-center">
            Lista de <strong>{nome}</strong> • {convidados.length} convidado{convidados.length !== 1 ? 's' : ''}
          </p>

          {/* Lista de convidados adicionados */}
          {convidados.length > 0 && (
            <div className="w-full max-w-[420px] max-h-[180px] overflow-y-auto space-y-2">
              {convidados.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2">
                  <span className="text-black text-sm font-medium">{c}</span>
                  <button
                    onClick={() => handleRemoveConvidado(i)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label={`Remover ${c}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Toggle entre modos */}
          <div className="w-full max-w-[420px] mx-auto flex justify-end">
            <button
              type="button"
              onClick={() => setInputMode(inputMode === 'individual' ? 'colar' : 'individual')}
              className="text-xs text-blue-500 hover:text-blue-700 underline transition-colors"
            >
              {inputMode === 'individual' ? '📋 Colar lista de nomes' : '✏️ Adicionar um por um'}
            </button>
          </div>

          {inputMode === 'individual' ? (
            /* Campo adicionar convidado individual */
            <div className="w-full flex gap-2 max-w-[420px] mx-auto">
              <input
                type="text"
                value={novoConvidado}
                onChange={(e) => setNovoConvidado(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-[42px] bg-[#D9D9D9] rounded-lg px-4 text-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all duration-300 font-medium"
                placeholder="Nome do convidado"
              />
              <button
                onClick={handleAddConvidado}
                className="h-[42px] px-4 bg-brand-gold text-black rounded-lg hover:brightness-110 transition-all font-bold flex items-center gap-1"
                type="button"
              >
                <Plus size={18} />
              </button>
            </div>
          ) : (
            /* Modo colar lista */
            <div className="w-full max-w-[420px] mx-auto flex flex-col gap-2">
              <textarea
                value={textoColar}
                onChange={(e) => setTextoColar(e.target.value)}
                className="w-full h-[120px] bg-[#D9D9D9] rounded-lg p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all duration-300 font-medium resize-none"
                placeholder={"Cole os nomes aqui\n(um nome por linha)\n\nEx:\nJoão Silva\nMaria Santos\nPedro Oliveira"}
              />
              <button
                type="button"
                onClick={handleColarNomes}
                className="self-end bg-brand-gold text-black font-bold py-2 px-5 rounded-lg hover:brightness-110 transition-all text-sm"
              >
                Adicionar Todos
              </button>
            </div>
          )}

          {/* Botão finalizar */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-2 bg-gradient-to-r from-brand-success to-brand-success2 text-white font-bold py-3 px-8 rounded-lg hover:brightness-110 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Enviando...
              </span>
            ) : (
              `Finalizar Lista (${convidados.length} convidado${convidados.length !== 1 ? 's' : ''})`
            )}
          </button>
        </div>
      )}

      {/* ========== STEP: SUCESSO ========== */}
      {step === 'sucesso' && (
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <div className="text-5xl">{tipo === 'aniversario' ? '🎂' : '🎉'}</div>
          <h2 className="text-brand-gold text-2xl sm:text-3xl font-bold">Obrigado!</h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            A lista de <strong>{nome}</strong> foi criada com sucesso!
          </p>
          <p className="text-gray-500 text-sm">
            {tipo === 'aniversario' ? 'Lista Aniversário' : 'Lista Convencional'} • {convidados.length} convidado{convidados.length !== 1 ? 's' : ''}
          </p>
          <p className="text-gray-400 text-sm">Aguarde nosso contato em breve!</p>
        </div>
      )}
    </section>
  );
};
