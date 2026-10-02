import React from 'react';
import { TenantApplication, HouseholdMember } from '../../types/rental';
import { Users, Plus, Trash2, PawPrint, Car, Calendar, ChevronLeft } from 'lucide-react';

interface Step3Props {
  data: TenantApplication;
  onChange: (updates: Partial<TenantApplication>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3Household: React.FC<Step3Props> = ({ data, onChange, onNext, onPrev }) => {
  const addMember = () => {
    const newMember: HouseholdMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      relationship: 'Cônjuge',
      age: '',
      hasIncome: false,
      monthlyIncome: 0,
    };
    onChange({
      members: [...data.members, newMember],
      totalResidents: data.members.length + 2, // titular + current + new
    });
  };

  const removeMember = (id: string) => {
    const updated = data.members.filter((m) => m.id !== id);
    onChange({
      members: updated,
      totalResidents: updated.length + 1,
    });
  };

  const updateMember = (id: string, updates: Partial<HouseholdMember>) => {
    const updated = data.members.map((m) => (m.id === id ? { ...m, ...updates } : m));
    onChange({ members: updated });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Passo 3: Moradores, Família & Veículo
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          A casa possui 3 dormitórios (sendo 1 suíte), jardim de inverno e espaço de garagem para até 3 carros.
        </p>
      </div>

      {/* Household Members */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Outros Moradores Além do Titular ({data.members.length})
          </label>
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Outro Morador
          </button>
        </div>

        {data.members.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Apenas o titular residirá no imóvel? Caso more com cônjuge, filhos ou parentes, clique no botão acima para adicioná-los.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.members.map((member, index) => (
              <div
                key={member.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">
                  <span>Morador #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remover
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do morador"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, { name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Parentesco
                    </label>
                    <select
                      value={member.relationship}
                      onChange={(e) => updateMember(member.id, { relationship: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:border-emerald-600"
                    >
                      <option value="Cônjuge">Cônjuge / Esposo(a)</option>
                      <option value="Filho(a)">Filho(a)</option>
                      <option value="Mãe / Pai">Mãe / Pai</option>
                      <option value="Irmão(ã)">Irmão(ã)</option>
                      <option value="Amigo(a) / Colega">Amigo(a) / Colega</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Idade
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 30"
                      value={member.age}
                      onChange={(e) => updateMember(member.id, { age: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={member.hasIncome}
                      onChange={(e) => updateMember(member.id, { hasIncome: e.target.checked })}
                      className="rounded text-emerald-600 accent-emerald-600"
                    />
                    <span>Este morador possui renda e irá compor a renda familiar</span>
                  </label>

                  {member.hasIncome && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500">Renda: R$</span>
                      <input
                        type="number"
                        placeholder="Ex: 2500"
                        value={member.monthlyIncome || ''}
                        onChange={(e) =>
                          updateMember(member.id, { monthlyIncome: parseFloat(e.target.value) || 0 })
                        }
                        className="w-28 px-2 py-1 rounded border border-slate-300 text-xs focus:border-emerald-600 font-semibold"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pets & Vehicle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Pets */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800">Animais de Estimação</h3>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasPets}
              onChange={(e) => onChange({ hasPets: e.target.checked })}
              className="rounded text-emerald-600 accent-emerald-600"
            />
            <span>Possui algum pet (cachorro, gato, etc.)?</span>
          </label>

          {data.hasPets && (
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Detalhes dos pets (espécie, quantidade e porte)
              </label>
              <input
                type="text"
                placeholder="Ex: 1 cachorro pequeno porte (pug, silencioso)"
                value={data.petDetails || ''}
                onChange={(e) => onChange({ petDetails: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-emerald-600"
              />
            </div>
          )}
        </div>

        {/* Vehicle */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800">Veículo & Garagem</h3>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasVehicle}
              onChange={(e) => onChange({ hasVehicle: e.target.checked })}
              className="rounded text-emerald-600 accent-emerald-600"
            />
            <span>Irá utilizar as vagas de garagem (espaço para até 3 carros)?</span>
          </label>

          {data.hasVehicle && (
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Modelo do carro ou moto
              </label>
              <input
                type="text"
                placeholder="Ex: Fiat Argo (carro de passeio)"
                value={data.vehicleDetails || ''}
                onChange={(e) => onChange({ vehicleDetails: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:border-emerald-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Intended Move Date */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          Previsão Pretendida para Início da Locação / Mudança *
        </label>
        <select
          value={data.intendedMoveDate}
          onChange={(e) => onChange({ intendedMoveDate: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
        >
          <option value="Imediata (dentro de 10 a 15 dias)">Imediata (dentro de 10 a 15 dias)</option>
          <option value="Dentro de 30 dias">Dentro de 30 dias</option>
          <option value="No próximo mês">No próximo mês</option>
          <option value="A combinar com o proprietário">A combinar com o proprietário</option>
        </select>
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
          Avançar para Garantia Locatícia →
        </button>
      </div>
    </form>
  );
};
