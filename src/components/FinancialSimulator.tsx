import React, { useState } from 'react';
import { HOUSE_DATA } from '../data/houseData';
import { formatCurrency } from '../utils/masks';
import { Calculator, CheckCircle2, AlertTriangle, Info, TrendingUp, ShieldCheck } from 'lucide-react';

export const FinancialSimulator: React.FC = () => {
  const [userIncome, setUserIncome] = useState<number>(4500);
  const totalMonthlyCost = HOUSE_DATA.rentAmount; // R$ 1.250 / mês
  const recommendedIncome = totalMonthlyCost * 3; // 3x standard rule: R$ 3.750

  const commitmentRatio = userIncome > 0 ? (totalMonthlyCost / userIncome) * 100 : 100;
  const isOptimal = commitmentRatio <= 33;
  const isAcceptable = commitmentRatio > 33 && commitmentRatio <= 40;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Simulador de Renda & Custos</h3>
            <p className="text-xs text-slate-500">
              Verifique a compatibilidade financeira para o aluguel de {formatCurrency(HOUSE_DATA.rentAmount)}/mês
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
          Aluguel: {formatCurrency(totalMonthlyCost)}/mês
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Income gauge simulator */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <label htmlFor="income-range" className="text-slate-700">
                Sua Renda Familiar Bruta (Você + Familiares):
              </label>
              <span className="text-sm font-bold text-emerald-700">
                {formatCurrency(userIncome)}
              </span>
            </div>

            <input
              id="income-range"
              type="range"
              min={1800}
              max={12000}
              step={100}
              value={userIncome}
              onChange={(e) => setUserIncome(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>R$ 1.800</span>
              <span>Recomendado: {formatCurrency(recommendedIncome)} (3x aluguel)</span>
              <span>R$ 12.000+</span>
            </div>
          </div>

          {/* Analysis box */}
          <div
            className={`p-4 rounded-xl border text-sm transition-all ${
              isOptimal
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : isAcceptable
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {isOptimal ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : isAcceptable ? (
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-xs uppercase tracking-wider">
                  Comprometimento da Renda: {commitmentRatio.toFixed(1)}%
                </div>
                <p className="text-xs leading-relaxed">
                  {isOptimal && (
                    <span>
                      <strong>Excelente perfil financeiro!</strong> O aluguel de {formatCurrency(HOUSE_DATA.rentAmount)} compromete menos de 33% da sua renda mensal. Alta probabilidade de aprovação rápida com o locador.
                    </span>
                  )}
                  {isAcceptable && (
                    <span>
                      <strong>Perfil viável.</strong> Comprometimento entre 33% e 40%. Você pode compor renda com o cônjuge ou outro morador para reforçar sua proposta.
                    </span>
                  )}
                  {!isOptimal && !isAcceptable && (
                    <span>
                      <strong>Atenção:</strong> O aluguel compromete mais de 40% da renda informada. É aconselhável adicionar a renda de outros moradores ou optar por caução de 3 meses.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Dica:</strong> Aluguel direto com o proprietário sem taxa administrativa nem taxa condominial.
            </span>
          </div>
        </div>

        {/* Right: Guarantee comparison with exact 1250 values */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Garantias Aceitas para Esta Casa
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition">
              <div className="flex justify-between items-center font-bold text-slate-900 mb-1">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Depósito Caução (3 Aluguéis)
                </span>
                <span className="font-extrabold text-emerald-700">
                  {formatCurrency(HOUSE_DATA.rentAmount * 3)}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                3 meses de aluguel (3 x R$ 1.250). Depositado em conta caução e devolvido integralmente corrigido ao final da locação.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition">
              <div className="flex justify-between items-center font-bold text-slate-900 mb-1">
                <span className="flex items-center gap-1.5 text-blue-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Seguro Fiança Locatícia
                </span>
                <span className="font-extrabold text-blue-700">~R$ 100 a R$ 125/mês</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Sem fiador e sem precisar dispor do valor do caução à vista. Parcelado mensalmente.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition">
              <div className="flex justify-between items-center font-bold text-slate-900 mb-1">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Fiador com Imóvel em SP
                </span>
                <span className="font-extrabold text-amber-700">R$ 0,00</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Fiador idôneo com imóvel próprio quitado e registrado no Estado de São Paulo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
