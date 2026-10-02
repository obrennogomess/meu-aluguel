import React, { useState } from 'react';
import { TenantApplication } from '../types/rental';
import { formatCurrency } from '../utils/masks';
import { 
  Building2, 
  Search, 
  Filter, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Eye,
  Calendar,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  applications: TenantApplication[];
  onUpdateApplication: (id: string, updates: Partial<TenantApplication>) => void;
  onOpenDossier: (app: TenantApplication) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  applications,
  onUpdateApplication,
  onOpenDossier,
  onExitAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedApp, setSelectedApp] = useState<TenantApplication | null>(
    applications.length > 0 ? applications[0] : null
  );

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.cpf.includes(searchTerm) ||
      app.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TenantApplication['status']) => {
    switch (status) {
      case 'aprovado':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Aprovada
          </span>
        );
      case 'em_analise':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Em Análise
          </span>
        );
      case 'documentos_aprovados':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Docs Aprovados
          </span>
        );
      case 'rejeitado':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Rejeitada
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Nova / Pendente
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Painel do Locador / Gestor do Imóvel</h2>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Gerenciamento e análise de fichas recebidas para a Casa em Itaquera - R$ 1.250/mês (OLX 1524691859)
          </p>
        </div>

        <button
          onClick={onExitAdmin}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          ← Voltar para Ficha de Inscrição
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou protocolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:border-emerald-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-600 font-medium">Filtrar:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:border-emerald-600"
          >
            <option value="todos">Todos os Status ({applications.length})</option>
            <option value="pendente">Pendente / Nova</option>
            <option value="em_analise">Em Análise</option>
            <option value="documentos_aprovados">Docs Aprovados</option>
            <option value="aprovado">Aprovada</option>
            <option value="rejeitado">Rejeitada</option>
          </select>
        </div>
      </div>

      {/* Body: Split View */}
      {applications.length === 0 ? (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <p className="text-sm">Nenhuma proposta cadastrada ainda.</p>
          <p className="text-xs text-slate-400">
            Preencha a ficha ou use o botão "Preencher com Dados de Exemplo" na página inicial para simular.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* List col */}
          <div className="lg:col-span-5 border-r border-slate-200 overflow-y-auto max-h-[600px] divide-y divide-slate-100">
            {filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 transition cursor-pointer hover:bg-slate-50 ${
                    isSelected ? 'bg-emerald-50/50 border-l-4 border-emerald-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-500">
                        {app.protocolNumber}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{app.fullName}</h4>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                    <div>
                      <span className="font-semibold text-slate-800">{app.occupation}</span> · Renda:{' '}
                      <span className="font-bold text-emerald-700">
                        {formatCurrency(app.monthlyGrossIncome)}
                      </span>
                    </div>
                    <div>
                      Garantia:{' '}
                      <span className="capitalize font-medium text-slate-700">
                        {app.guaranteeType.replace('_', ' ')}
                      </span>{' '}
                      · {app.documents.length} doc(s)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Enviado em: {new Date(app.createdAt).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(app.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details col */}
          <div className="lg:col-span-7 p-5 sm:p-6 overflow-y-auto max-h-[600px] space-y-5 bg-white">
            {selectedApp ? (
              <div className="space-y-5">
                {/* Header of selected app */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="text-xs font-mono text-slate-400">
                      {selectedApp.protocolNumber}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedApp.fullName}</h3>
                    <div className="text-xs text-slate-500">CPF: {selectedApp.cpf}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDossier(selectedApp)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Dossiê Completo
                    </button>
                    <a
                      href={`https://wa.me/55${selectedApp.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Alterar Status da Análise
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['pendente', 'em_analise', 'documentos_aprovados', 'aprovado', 'rejeitado'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            onUpdateApplication(selectedApp.id, { status: st });
                            setSelectedApp({ ...selectedApp, status: st });
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            selectedApp.status === st
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {st.replace('_', ' ').toUpperCase()}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Renda Declarada Titular</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {formatCurrency(selectedApp.monthlyGrossIncome)}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Garantia Selecionada</span>
                    <span className="font-bold text-emerald-800 capitalize text-sm">
                      {selectedApp.guaranteeType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Vínculo & Empresa</span>
                    <span className="font-semibold text-slate-800">
                      {selectedApp.companyName} ({selectedApp.employmentType.toUpperCase()})
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Total de Moradores</span>
                    <span className="font-semibold text-slate-800">
                      {selectedApp.members.length + 1} pessoa(s)
                    </span>
                  </div>
                </div>

                {/* Documents view */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Documentos Anexados ({selectedApp.documents.length})
                  </div>
                  {selectedApp.documents.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">Nenhum anexo enviado.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {selectedApp.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                        >
                          <span className="font-medium text-slate-700 truncate">{doc.fileName}</span>
                          <span className="text-slate-400 text-[11px]">{doc.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Landlord internal notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Anotações Internas do Locador (Visitas, Observações)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Visita presencial agendada para sábado às 10h. Candidato trouxe comprovantes físicos."
                    value={selectedApp.landlordNotes || ''}
                    onChange={(e) => {
                      const updated = { ...selectedApp, landlordNotes: e.target.value };
                      setSelectedApp(updated);
                      onUpdateApplication(selectedApp.id, { landlordNotes: e.target.value });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-emerald-600"
                  />
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">Selecione uma proposta ao lado.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
