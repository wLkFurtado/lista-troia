import React from 'react'
import { CheckCircle2 } from 'lucide-react'

export const ThankYouMessage: React.FC = () => {
  return (
    <div id="thank-you-message" className="w-full h-full flex items-center justify-center text-center">
      <div className="flex flex-col items-center gap-3">
        <CheckCircle2 className="text-brand-success" size={48} />
        <h2 className="text-brand-gold text-3xl font-bold">Obrigado!</h2>
        <p className="text-brand-neutral700 text-lg leading-relaxed">
          Seu nome foi adicionado à
          <br />
          <strong>Lista VIP</strong> com sucesso.
        </p>
        <p className="text-brand-neutral500 text-base">Aguarde nosso contato em breve!</p>
      </div>
    </div>
  )
}
