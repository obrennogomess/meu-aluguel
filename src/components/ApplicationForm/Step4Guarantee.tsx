import React from 'react';
import { TenantApplication, GuaranteeType } from '../../types/rental';
import { HOUSE_DATA } from '../../data/houseData';
import { formatCurrency } from '../../utils/masks';
import { ShieldCheck, MessageSquare, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface Step4Props {
  data: TenantApplication;
  onChange: (updates: Partial<TenantApplication>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4Guarantee: React.FC<Step4Props> = ({ data, onChange, onNext, onPrev }) => {
  const depositAmount = HOUSE_DATA.rentAmount * 3;

  const guaranteeOptions: {
    id: GuaranteeType;
    title: string;
    badge: string;
    description: string;
    costInfo: string;
  }[] = [
    {
      id: 'caucao',
      title: 'Depósito Caução (3 Aluguéis)',
      badge: 'Mais Popular & Direto',
      description:
        'Você deposita o valor em conta poupança específica conforme a Lei do Inquilinato. O valor total com rendimentos é devolvido a você ao término do contrato.',
      costInfo: `Valor: ${formatCurrency(depositAmount)} (devolvido 100% com rendimentos)`,
    },
    {
      id: 'seguro_fianca',
      title: 'Seguro Fiança (Sem Fiador e Sem Caução)',
      badge: 'Não Descapitaliza',
      description:
        'A seguradora é sua fiadora. Aprovação ágil e sem necessidade de desembolsar o valor de 3 aluguéis à vista.',
      costInfo: 'Custo estimado: ~8% a 10% do aluguel (~R$ 150 a R$ 185/mês parcelado)',
    },
    {
      id: 'fiador',
      title: 'Fiador com Imóvel em SP',
      badge: 'Sem Custo Adicional',
      description:
        'Uma pessoa da sua confiança que possua imóvel próprio quitado e com matrícula registrada na capital ou região metropolitana de SP.',
      costInfo: 'Custo: R$ 0,00 (apenas envio da certidão de matrícula do imóvel do fiador)',
    },
    {
      id: 'titulo_capitalizacao',
      title: 'Título de Capitalização para Locação',
      badge: 'Garantia Financeira',
      description:
        'Adquirido via instituição financeira vinculada à locação, com resgate integral ao final do contrato e sorteios mensais.',
      costInfo: 'Custo: ~4 a 6 aluguéis resgatáveis',
    },
  ];

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Passo 4: Escolha da Garantia Locatícia
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Selecione a modalidade de garantia com a qual deseja alugar a casa em Itaquera.
        </p>
      </div>

      <div className="space-y-3">
        {guaranteeOptions.map((opt) => {
          const isSelected = data.guaranteeType === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChange({ guaranteeType: opt.id })}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{opt.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{opt.description}</p>
                    <div className="text-xs font-semibold text-emerald-800 mt-1.5">{opt.costInfo}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Observações sobre a Garantia (Opcional)
        </label>
        <input
          type="text"
          placeholder="Ex: Já possuo o valor da caução em conta corrente / Tenho fiador com casa em Itaquera"
          value={data.guaranteeNotes || ''}
          onChange={(e) => onChange({ guaranteeNotes: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600"
        />
      </div>

      {/* Message to Landlord */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          Mensagem ou Proposta ao Proprietário (Opcional)
        </label>
        <textarea
          rows={3}
          placeholder="Conte um pouco sobre sua família, hábitos e rotina de trabalho. Isso ajuda o locador a conhecer você melhor e agilizar a resposta."
          value={data.proposalNotes || ''}
          onChange={(e) => onChange({ proposalNotes: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:border-emerald-600"
        />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-3">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-lg shadow-xs transition-all cursor-pointer"
        >
          Avançar para Anexar Documentos →
        </button>
      </div>
    </form>
  );
};
