import React from 'react';
import { HOUSE_DATA } from '../data/houseData';
import { formatCurrency } from '../utils/masks';
import { 
  Home, 
  MapPin, 
  BedDouble, 
  Bath, 
  Car, 
  Flower2, 
  ShieldCheck, 
  ExternalLink,
  CheckCircle2,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface HouseHeaderProps {
  onStartApplication: () => void;
}

export const HouseHeader: React.FC<HouseHeaderProps> = ({ onStartApplication }) => {
  const totalMonthly = HOUSE_DATA.rentAmount + HOUSE_DATA.condoFee + HOUSE_DATA.iptuFee;

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation / Breadcrumb line */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Meu Aluguel
            </span>
            <span>/</span>
            <span>São Paulo</span>
            <span>/</span>
            <span>Zona Leste</span>
            <span>/</span>
            <span className="text-slate-800 font-medium">Itaquera (Jd. Soraia)</span>
          </div>

          <a
            href={HOUSE_DATA.olxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors text-xs font-semibold rounded-md"
            title="Ver anúncio oficial publicado na OLX"
          >
            <span>Ver anúncio oficial na OLX (Cód: {HOUSE_DATA.olxId})</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Main Title & Action block */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                Disponível para Locação
              </span>
              <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Aluga Direto com o Proprietário
              </span>
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
                Com Jardim de Inverno
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {HOUSE_DATA.title}
            </h1>
            
            <p className="flex items-center gap-1.5 text-sm sm:text-base text-slate-600 mt-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{HOUSE_DATA.neighborhood}, {HOUSE_DATA.city} - {HOUSE_DATA.state}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 text-xs sm:text-sm">{HOUSE_DATA.addressHint}</span>
            </p>
          </div>

          {/* Pricing & CTA Card with EXACT R$ 1.250 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Valor do Aluguel
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">
                {formatCurrency(HOUSE_DATA.rentAmount)}
                <span className="text-sm font-normal text-slate-500">/mês</span>
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Sem taxa de condomínio · Negociação direta
              </div>
            </div>

            <button
              onClick={onStartApplication}
              type="button"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Preencher Ficha de Aluguel</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature quick specs bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Dormitórios</div>
              <div className="text-sm font-bold text-slate-800">{HOUSE_DATA.bedrooms} Quartos (1 Suíte)</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Garagem</div>
              <div className="text-sm font-bold text-slate-800">Vagas p/ 3 Carros</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Diferencial</div>
              <div className="text-sm font-bold text-slate-800">Jardim de Inverno</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Bath className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Banheiros</div>
              <div className="text-sm font-bold text-slate-800">2 (Suíte + Social)</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
