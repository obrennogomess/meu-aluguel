import React, { useState } from 'react';
import { TenantApplication } from '../../types/rental';
import { formatCPF, formatPhone, formatCEP, validateCPF, fetchAddressByCep } from '../../utils/masks';
import { User, Phone, Mail, MapPin, AlertCircle, CheckCircle2, Search, Loader2 } from 'lucide-react';

interface Step1Props {
  data: TenantApplication;
  onChange: (updates: Partial<TenantApplication>) => void;
  onNext: () => void;
}

export const Step1Personal: React.FC<Step1Props> = ({ data, onChange, onNext }) => {
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    onChange({ cpf: formatted });
    if (formatted.length === 14) {
      if (!validateCPF(formatted)) {
        setErrors((prev) => ({ ...prev, cpf: 'CPF inválido. Verifique os dígitos.' }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.cpf;
          return next;
        });
      }
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cpf;
        return next;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ phone: formatPhone(e.target.value) });
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatCEP(rawVal);
    onChange({
      currentAddress: {
        ...data.currentAddress,
        cep: formatted,
      },
    });

    const clean = rawVal.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsCepLoading(true);
      const address = await fetchAddressByCep(clean);
      setIsCepLoading(false);
      if (address) {
        onChange({
          currentAddress: {
            ...data.currentAddress,
            cep: formatted,
            street: address.street || data.currentAddress.street,
            neighborhood: address.neighborhood || data.currentAddress.neighborhood,
            city: address.city || data.currentAddress.city,
            state: address.state || data.currentAddress.state,
          },
        });
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim() || data.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Informe o nome completo (ao menos nome e sobrenome).';
    }
    if (!data.cpf || data.cpf.length !== 14 || !validateCPF(data.cpf)) {
      newErrors.cpf = 'Informe um CPF válido com 11 dígitos.';
    }
    if (!data.rg.trim()) {
      newErrors.rg = 'Informe o número do documento de identidade (RG).';
    }
    if (!data.birthDate) {
      newErrors.birthDate = 'Informe a data de nascimento.';
    }
    if (!data.phone || data.phone.length < 14) {
      newErrors.phone = 'Informe o WhatsApp/telefone com DDD.';
    }
    if (!data.email || !data.email.includes('@')) {
      newErrors.email = 'Informe um e-mail válido para contato.';
    }
    if (!data.currentAddress.street.trim()) {
      newErrors.street = 'Informe o logradouro (rua/avenida) atual.';
    }
    if (!data.currentAddress.number.trim()) {
      newErrors.number = 'Informe o número da residência atual.';
    }
    if (!data.currentAddress.city.trim()) {
      newErrors.city = 'Informe a cidade atual.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          <User className="w-5 h-5 text-emerald-600" />
          Passo 1: Dados Pessoais do Titular
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Preencha os dados de quem será o titular do contrato de locação da casa em Itaquera.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nome Completo do Titular *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Carlos Eduardo da Silva"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-hidden ${
              errors.fullName
                ? 'border-rose-300 ring-2 ring-rose-200/50 bg-rose-50/20'
                : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
            </p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            CPF do Titular *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              maxLength={14}
              placeholder="000.000.000-00"
              value={data.cpf}
              onChange={handleCpfChange}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-hidden ${
                errors.cpf
                  ? 'border-rose-300 ring-2 ring-rose-200/50 bg-rose-50/20'
                  : data.cpf.length === 14 && validateCPF(data.cpf)
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
              }`}
            />
            {data.cpf.length === 14 && validateCPF(data.cpf) && (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
            )}
          </div>
          {errors.cpf && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.cpf}
            </p>
          )}
        </div>

        {/* RG */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            RG / Documento de Identidade *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: 12.345.678-9"
            value={data.rg}
            onChange={(e) => onChange({ rg: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Órgão Emissor */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Órgão Emissor / UF
          </label>
          <input
            type="text"
            placeholder="Ex: SSP/SP"
            value={data.rgIssuer}
            onChange={(e) => onChange({ rgIssuer: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Data de Nascimento *
          </label>
          <input
            type="date"
            required
            value={data.birthDate}
            onChange={(e) => onChange({ birthDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Estado Civil */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Estado Civil *
          </label>
          <select
            value={data.maritalStatus}
            onChange={(e) => onChange({ maritalStatus: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-white"
          >
            <option value="solteiro">Solteiro(a)</option>
            <option value="casado">Casado(a)</option>
            <option value="uniao_estavel">União Estável</option>
            <option value="divorciado">Divorciado(a)</option>
            <option value="viuvo">Viúvo(a)</option>
          </select>
        </div>

        {/* WhatsApp / Telefone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            WhatsApp / Celular com DDD *
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              placeholder="(11) 98765-4321"
              value={data.phone}
              onChange={handlePhoneChange}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          {errors.phone && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
            </p>
          )}
        </div>

        {/* E-mail */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            E-mail para Notificações & Contrato *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="seu.email@exemplo.com"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Current Address Sub-section */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Endereço Residencial Atual do Titular
          </h3>
          <span className="text-[11px] text-slate-500">
            Digite o CEP para preenchimento automático
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* CEP */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              CEP Atual *
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={9}
                placeholder="00000-000"
                value={data.currentAddress.cep}
                onChange={handleCepChange}
                className="w-full pl-3.5 pr-8 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
              />
              <div className="absolute right-2.5 top-2.5 text-slate-400">
                {isCepLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>

          {/* Rua */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Logradouro (Rua, Avenida, Praça) *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Rua das Flores"
              value={data.currentAddress.street}
              onChange={(e) =>
                onChange({
                  currentAddress: { ...data.currentAddress, street: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
            />
          </div>

          {/* Número */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Número *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 120"
              value={data.currentAddress.number}
              onChange={(e) =>
                onChange({
                  currentAddress: { ...data.currentAddress, number: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
            />
          </div>

          {/* Complemento */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Complemento (Opcional)
            </label>
            <input
              type="text"
              placeholder="Apto 42, Bloco B, Casa 2"
              value={data.currentAddress.complement || ''}
              onChange={(e) =>
                onChange({
                  currentAddress: { ...data.currentAddress, complement: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
            />
          </div>

          {/* Bairro */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Bairro *
            </label>
            <input
              type="text"
              required
              placeholder="Bairro"
              value={data.currentAddress.neighborhood}
              onChange={(e) =>
                onChange({
                  currentAddress: { ...data.currentAddress, neighborhood: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
            />
          </div>

          {/* Cidade & Estado */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: São Paulo"
              value={data.currentAddress.city}
              onChange={(e) =>
                onChange({
                  currentAddress: { ...data.currentAddress, city: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Estado (UF) *
            </label>
            <input
              type="text"
              maxLength={2}
              required
              placeholder="SP"
              value={data.currentAddress.state}
              onChange={(e) =>
                onChange({
                  currentAddress: { ...data.currentAddress, state: e.target.value.toUpperCase() },
                })
              }
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
            />
          </div>

          {/* Situação da moradia */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Situação da Moradia Atual
            </label>
            <select
              value={data.housingStatus}
              onChange={(e) => onChange({ housingStatus: e.target.value as any })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600"
            >
              <option value="alugada">Imóvel Alugado</option>
              <option value="propria">Imóvel Próprio</option>
              <option value="familiar">Mora com familiares/pais</option>
              <option value="outra">Outro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-3">
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-lg shadow-xs transition-all cursor-pointer"
        >
          Avançar para Renda & Ocupação →
        </button>
      </div>
    </form>
  );
};
