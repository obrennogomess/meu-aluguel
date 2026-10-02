import React from 'react';
import { TenantApplication } from '../types/rental';
import { HOUSE_DATA } from '../data/houseData';
import { formatCurrency } from '../utils/masks';
import { Printer, X, Download, ShieldCheck, Check } from 'lucide-react';

interface DossierModalProps {
  application: TenantApplication;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ application, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const totalHouseholdIncome =
    (application.monthlyGrossIncome || 0) +
    (application.additionalIncome || 0) +
    application.members.reduce((acc, m) => acc + (m.hasIncome ? m.monthlyIncome || 0 : 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Action bar (hidden in print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-sm">
              Dossiê Cadastral de Proposta de Locação
            </span>
            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-semibold">
              {application.protocolNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-slate-800 font-sans space-y-6 print:p-0 print:space-y-4">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
                Ficha Cadastral e Proposta de Locação
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Sistema Meu Aluguel · Lei do Inquilinato (Lei nº 8.245/1991)
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500 font-medium">Protocolo Oficial</div>
              <div className="text-sm font-mono font-bold text-emerald-800">
                {application.protocolNumber}
              </div>
              <div className="text-[10px] text-slate-400">
                Data: {new Date(application.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Imóvel Pretendido */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
            <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              1. Imóvel Objeto da Locação
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <span className="text-slate-500 block">Tipo & Quartos:</span>
                <span className="font-semibold text-slate-800">3 Quartos (1 Suíte) + Jd. Inverno</span>
              </div>
              <div>
                <span className="text-slate-500 block">Localização:</span>
                <span className="font-semibold text-slate-800">Jd. Soraia / Itaquera - SP</span>
              </div>
              <div>
                <span className="text-slate-500 block">Garagem:</span>
                <span className="font-semibold text-slate-800">Vagas p/ 3 Carros</span>
              </div>
              <div>
                <span className="text-slate-500 block">Valor do Aluguel:</span>
                <span className="font-bold text-emerald-800">
                  {formatCurrency(HOUSE_DATA.rentAmount)}/mês
                </span>
              </div>
            </div>
          </div>

          {/* Dados do Proponente Titular */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase text-xs tracking-wider border-b pb-1">
              2. Dados do Proponente Titular
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Nome Completo:</span>
                <span className="font-semibold text-slate-900">{application.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">CPF:</span>
                <span className="font-semibold font-mono text-slate-900">{application.cpf}</span>
              </div>
              <div>
                <span className="text-slate-500 block">RG / Órgão:</span>
                <span className="font-semibold text-slate-900">
                  {application.rg} ({application.rgIssuer || 'SSP'})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Data de Nascimento:</span>
                <span className="font-semibold text-slate-900">
                  {application.birthDate ? new Date(application.birthDate).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Estado Civil:</span>
                <span className="capitalize font-semibold text-slate-900">
                  {application.maritalStatus.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">WhatsApp / Telefone:</span>
                <span className="font-semibold text-slate-900">{application.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">E-mail:</span>
                <span className="font-semibold text-slate-900">{application.email}</span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-slate-500 block">Endereço Residencial Atual:</span>
                <span className="font-semibold text-slate-900">
                  {application.currentAddress.street}, nº {application.currentAddress.number}{' '}
                  {application.currentAddress.complement && `(${application.currentAddress.complement})`} -{' '}
                  {application.currentAddress.neighborhood}, {application.currentAddress.city} -{' '}
                  {application.currentAddress.state} (CEP: {application.currentAddress.cep})
                </span>
              </div>
            </div>
          </div>

          {/* Dados Profissionais e Renda */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase text-xs tracking-wider border-b pb-1">
              3. Ocupação Profissional e Comprovação de Renda
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Profissão / Cargo:</span>
                <span className="font-semibold text-slate-900">{application.occupation}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Vínculo:</span>
                <span className="uppercase font-semibold text-slate-900">{application.employmentType}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Empresa / Empregador:</span>
                <span className="font-semibold text-slate-900">{application.companyName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Renda Bruta Mensal:</span>
                <span className="font-bold text-slate-900">{formatCurrency(application.monthlyGrossIncome)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Renda Familiar Combinada:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(totalHouseholdIncome)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Restrições SPC/Serasa:</span>
                <span className="font-semibold text-slate-900">
                  {application.hasCreditRestriction ? 'Sim (em negociação)' : 'Sem restrições'}
                </span>
              </div>
            </div>
          </div>

          {/* Moradores & Garantia */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase text-xs tracking-wider border-b pb-1">
              4. Composição Familiar & Garantia Pretendida
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Moradores no Imóvel:</span>
                <span className="font-semibold text-slate-900">{application.members.length + 1} pessoa(s)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Garantia Selecionada:</span>
                <span className="font-bold uppercase text-emerald-800">
                  {application.guaranteeType.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Possui Animais:</span>
                <span className="font-semibold text-slate-900">
                  {application.hasPets ? application.petDetails || 'Sim' : 'Não'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Previsão Mudança:</span>
                <span className="font-semibold text-slate-900">{application.intendedMoveDate}</span>
              </div>
            </div>
          </div>

          {/* Documentos Anexados */}
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-900 block">Documentos Cadastrados ({application.documents.length}):</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {application.documents.map((d) => (
                <span key={d.id} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700">
                  ✓ {d.title} ({d.fileName})
                </span>
              ))}
            </div>
          </div>

          {/* Assinatura */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-500 max-w-sm">
              Documento assinado digitalmente e transmitido com autorização de consulta cadastral e consentimento expresso da LGPD.
            </div>

            <div className="text-center">
              {application.signatureDataUrl ? (
                <div className="border-b border-slate-400 pb-1 mb-1">
                  <img
                    src={application.signatureDataUrl}
                    alt="Assinatura digital do titular"
                    className="h-12 mx-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-56 border-b border-slate-400 pb-1 mb-1 font-mono text-xs">
                  {application.fullName}
                </div>
              )}
              <div className="text-xs font-bold text-slate-800">{application.fullName}</div>
              <div className="text-[10px] text-slate-400">CPF: {application.cpf}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
