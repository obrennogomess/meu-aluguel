import React, { useState } from 'react';
import { TenantApplication } from '../../types/rental';
import { HOUSE_DATA } from '../../data/houseData';
import { formatCurrency } from '../../utils/masks';
import { Briefcase, DollarSign, AlertTriangle, CheckCircle2, ChevronLeft, Info } from 'lucide-react';

interface Step2Props {
  data: TenantApplication;
  onChange: (updates: Partial<TenantApplication>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Income: React.FC<Step2Props> = ({ data, onChange, onNext, onPrev }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalPackageCost = HOUSE_DATA.rentAmount + HOUSE_DATA.condoFee + HOUSE_DATA.iptuFee;
  const totalGross = (data.monthlyGrossIncome || 0) + (data.additionalIncome || 0);
  const ratio = totalGross > 0 ? (totalPackageCost / totalGross) * 100 : 100;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.occupation.trim()) {
      errs.occupation = 'Informe sua profissão ou cargo atual.';
    }
    if (!data.companyName.trim()) {
      errs.companyName = 'Informe o nome da empresa ou atividade principal.';
    }
    if (!data.monthlyGrossIncome || data.monthlyGrossIncome < 1000) {
      errs.monthlyGrossIncome = 'Informe a renda mensal bruta válida.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          Passo 2: Ocupação Profissional & Renda
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprovação de rendimentos para análise de locação da casa em Itaquera (Aluguel: {formatCurrency(HOUSE_DATA.rentAmount)}/mês).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Profissão / Cargo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Profissão / Cargo *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Gerente Administrativo, Mecânico, etc."
            value={data.occupation}
            onChange={(e) => onChange({ occupation: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
          {errors.occupation && (
            <p className="text-xs text-rose-600 mt-1">{errors.occupation}</p>
          )}
        </div>

        {/* Tipo de Vínculo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tipo de Vínculo Empregatício *
          </label>
          <select
            value={data.employmentType}
            onChange={(e) => onChange({ employmentType: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-white"
          >
            <option value="clt">CLT (Carteira Assinada)</option>
            <option value="servidor">Servidor Público (Estável / Concursado)</option>
            <option value="pj_mei">PJ / MEI (Pessoa Jurídica / Microempreendedor)</option>
            <option value="autonomo">Profissional Autônomo / Liberal</option>
            <option value="aposentado_pensionista">Aposentado(a) / Pensionista INSS</option>
            <option value="empresario">Empresário / Sócio</option>
          </select>
        </div>

        {/* Nome da Empresa */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Empresa Empregadora / Atividade *
          </label>
          <input
            type="text"
            required
            placeholder="Nome da empresa ou 'Próprio negócio'"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
          {errors.companyName && (
            <p className="text-xs text-rose-600 mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* Tempo no Trabalho */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tempo no Emprego / Atividade Atual
          </label>
          <input
            type="text"
            placeholder="Ex: 2 anos e 3 meses"
            value={data.employmentDuration}
            onChange={(e) => onChange({ employmentDuration: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Renda Bruta Mensal */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Renda Bruta Mensal do Titular (R$) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
            <input
              type="number"
              min={0}
              step={50}
              required
              placeholder="0,00"
              value={data.monthlyGrossIncome || ''}
              onChange={(e) => onChange({ monthlyGrossIncome: parseFloat(e.target.value) || 0 })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-semibold text-slate-900"
            />
          </div>
          {errors.monthlyGrossIncome && (
            <p className="text-xs text-rose-600 mt-1">{errors.monthlyGrossIncome}</p>
          )}
        </div>

        {/* Outras Rendas */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Renda Adicional Comprovada (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">R$</span>
            <input
              type="number"
              min={0}
              step={50}
              placeholder="0,00 (opcional)"
              value={data.additionalIncome || ''}
              onChange={(e) => onChange({ additionalIncome: parseFloat(e.target.value) || 0 })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {data.additionalIncome > 0 && (
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Origem da Renda Adicional
            </label>
            <input
              type="text"
              placeholder="Ex: Pensão alimentícia, bicos formalizados, comissões, aluguel recebido"
              value={data.additionalIncomeSource || ''}
              onChange={(e) => onChange({ additionalIncomeSource: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600"
            />
          </div>
        )}
      </div>

      {/* Renda Summary Box */}
      {totalGross > 0 && (
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div>
            <div className="text-slate-500 font-medium">Total de Renda Informada</div>
            <div className="text-xl font-black text-slate-900">{formatCurrency(totalGross)}</div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-slate-500 font-medium">Comprometimento com o Aluguel</div>
            <div className={`font-bold ${ratio <= 35 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {ratio.toFixed(1)}% da renda mensal ({formatCurrency(totalPackageCost)}/mês)
            </div>
          </div>
        </div>
      )}

      {/* Restrições no SPC/Serasa */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.hasCreditRestriction}
            onChange={(e) => onChange({ hasCreditRestriction: e.target.checked })}
            className="mt-1 w-4 h-4 rounded text-emerald-600 accent-emerald-600"
          />
          <div>
            <div className="text-xs font-bold text-slate-800">
              Possui alguma restrição cadastral ativa (ex: SPC, Serasa ou protesto)?
            </div>
            <div className="text-xs text-slate-500">
              Não se preocupe: ter restrição não elimina sua proposta automaticamente, dependendo da garantia escolhida (ex: Caução ou fiador com imóvel).
            </div>
          </div>
        </label>

        {data.hasCreditRestriction && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Explicação / Detalhes da Restrição
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Pequena dívida em renegociação, protesto de valor baixo, etc."
              value={data.creditRestrictionDetails || ''}
              onChange={(e) => onChange({ creditRestrictionDetails: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-emerald-600"
            />
          </div>
        )}
      </div>

      {/* Nav buttons */}
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
          Avançar para Moradores & Família →
        </button>
      </div>
    </form>
  );
};
