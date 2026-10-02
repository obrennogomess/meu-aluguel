import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TenantApplication } from '../types/rental';
import { HOUSE_DATA } from '../data/houseData';
import { formatCurrency } from '../utils/masks';
import { 
  CheckCircle2, 
  Share2, 
  Printer, 
  MessageCircle, 
  Copy, 
  Check, 
  Clock, 
  Home, 
  FileText,
  X
} from 'lucide-react';

interface SuccessProps {
  application: TenantApplication;
  onClose: () => void;
  onOpenDossier: () => void;
}

export const SubmissionSuccessModal: React.FC<SuccessProps> = ({
  application,
  onClose,
  onOpenDossier,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  }, []);

  const totalHouseholdIncome =
    (application.monthlyGrossIncome || 0) +
    (application.additionalIncome || 0) +
    application.members.reduce((acc, m) => acc + (m.hasIncome ? m.monthlyIncome || 0 : 0), 0);

  // WhatsApp message generation
  const generateWhatsAppMessage = () => {
    const text = `*Olá! Acabei de enviar minha Ficha de Proposta de Aluguel pelo app Meu Aluguel:*
    
🏡 *Imóvel:* Alugo casa em Itaquera - R$ 1.250/mês (OLX: ${HOUSE_DATA.olxId})
🔖 *Protocolo:* ${application.protocolNumber}
👤 *Titular:* ${application.fullName}
📱 *Telefone:* ${application.phone}
💼 *Profissão:* ${application.occupation} (${application.employmentType.toUpperCase()})
💰 *Renda Comprovada:* ${formatCurrency(totalHouseholdIncome)}/mês
🛡️ *Garantia Escolhida:* ${application.guaranteeType.replace('_', ' ').toUpperCase()}
👨‍👩‍👧 *Moradores:* ${application.members.length + 1} pessoas
🚗 *Garagem:* Vagas para 3 carros
🌿 *Diferencial:* Jardim de inverno
📅 *Previsão:* ${application.intendedMoveDate}
📎 *Documentos Anexados:* ${application.documents.length} arquivo(s)

Gostaria de confirmar o recebimento e agendar a visita presencial ao imóvel!`;

    return encodeURIComponent(text);
  };

  const copyProtocol = () => {
    navigator.clipboard.writeText(application.protocolNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Proposta Enviada com Sucesso
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Parabéns, {application.fullName.split(' ')[0]}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
              Sua ficha cadastral para a <strong>Casa em Itaquera (R$ 1.250/mês)</strong> foi registrada com sucesso.
            </p>
          </div>
        </div>

        {/* Protocol Box */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
              Protocolo da Proposta
            </div>
            <div className="text-lg font-mono font-bold text-slate-900">
              {application.protocolNumber}
            </div>
          </div>

          <button
            onClick={copyProtocol}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        {/* Status timeline */}
        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Próximos Passos
          </div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-950">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                1
              </span>
              <span>
                <strong>Análise dos Documentos:</strong> O proprietário/gestor irá verificar seus dados e comprovantes nas próximas 24 horas úteis.
              </span>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                2
              </span>
              <span>
                <strong>Agendamento de Visita:</strong> Com os dados aprovados, você receberá mensagem no WhatsApp para visitar presencialmente a vila e a casa em Itaquera.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <a
            href={`https://wa.me/?text=${generateWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Enviar Proposta no WhatsApp do Proprietário</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenDossier}
              className="py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Dossiê / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Voltar para o Imóvel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
