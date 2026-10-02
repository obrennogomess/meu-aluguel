/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TenantApplication } from './types/rental';
import { HOUSE_DATA } from './data/houseData';
import { generateProtocolNumber, getSampleTenantData } from './utils/masks';
import { HouseHeader } from './components/HouseHeader';
import { HouseGallery } from './components/HouseGallery';
import { FinancialSimulator } from './components/FinancialSimulator';
import { Step1Personal } from './components/ApplicationForm/Step1Personal';
import { Step2Income } from './components/ApplicationForm/Step2Income';
import { Step3Household } from './components/ApplicationForm/Step3Household';
import { Step4Guarantee } from './components/ApplicationForm/Step4Guarantee';
import { Step5Documents } from './components/ApplicationForm/Step5Documents';
import { Step6ReviewSign } from './components/ApplicationForm/Step6ReviewSign';
import { SubmissionSuccessModal } from './components/SubmissionSuccessModal';
import { DossierModal } from './components/DossierModal';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  Home, 
  Sparkles, 
  Building2, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  FileText,
  User,
  Briefcase,
  Users,
  Lock,
  ArrowRight
} from 'lucide-react';

const STORAGE_KEY_PROPOSALS = 'meu_aluguel_proposals_v1';
const STORAGE_KEY_DRAFT = 'meu_aluguel_draft_v1';

const defaultEmptyApplication: TenantApplication = {
  id: '',
  protocolNumber: '',
  createdAt: '',
  updatedAt: '',
  status: 'pendente',
  fullName: '',
  cpf: '',
  rg: '',
  rgIssuer: 'SSP/SP',
  birthDate: '',
  maritalStatus: 'solteiro',
  nationality: 'Brasileira',
  phone: '',
  email: '',
  currentAddress: {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
  },
  housingStatus: 'alugada',
  occupation: '',
  employmentType: 'clt',
  companyName: '',
  employmentDuration: '',
  monthlyGrossIncome: 0,
  additionalIncome: 0,
  additionalIncomeSource: '',
  hasCreditRestriction: false,
  creditRestrictionDetails: '',
  totalResidents: 1,
  members: [],
  hasPets: false,
  petDetails: '',
  hasVehicle: false,
  vehicleDetails: '',
  intendedMoveDate: 'Imediata (dentro de 10 a 15 dias)',
  guaranteeType: 'caucao',
  guaranteeNotes: '',
  proposalNotes: '',
  documents: [],
  authorizedCreditCheck: false,
  declaredAccurate: false,
  signatureDataUrl: undefined,
  landlordNotes: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [applicationData, setApplicationData] = useState<TenantApplication>(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (savedDraft) {
        return { ...defaultEmptyApplication, ...JSON.parse(savedDraft) };
      }
    } catch {
      // fallback
    }
    return {
      ...defaultEmptyApplication,
      id: Math.random().toString(36).substring(2, 9),
      protocolNumber: generateProtocolNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [allApplications, setAllApplications] = useState<TenantApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPOSALS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApplication, setSubmittedApplication] = useState<TenantApplication | null>(null);
  const [dossierApplication, setDossierApplication] = useState<TenantApplication | null>(null);
  const [draftSavedToast, setDraftSavedToast] = useState<boolean>(false);

  const formSectionRef = useRef<HTMLDivElement | null>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!isAdminView && applicationData.fullName) {
      try {
        localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(applicationData));
      } catch {
        // quota exceeded fallback
      }
    }
  }, [applicationData, isAdminView]);

  // Save applications list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(allApplications));
    } catch {
      // fallback
    }
  }, [allApplications]);

  const updateApplication = (updates: Partial<TenantApplication>) => {
    setApplicationData((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
    scrollToForm();
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToForm();
  };

  const scrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pre-fill with sample tenant data for easy evaluation
  const handleFillSample = () => {
    const sample = getSampleTenantData();
    const updated: TenantApplication = {
      ...applicationData,
      ...sample,
      id: applicationData.id || Math.random().toString(36).substring(2, 9),
      protocolNumber: applicationData.protocolNumber || generateProtocolNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentAddress: {
        ...applicationData.currentAddress,
        ...(sample.currentAddress || {}),
      },
    } as TenantApplication;

    setApplicationData(updated);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  // Reset form
  const handleResetForm = () => {
    if (window.confirm('Deseja limpar todos os campos da proposta e recomeçar do zero?')) {
      localStorage.removeItem(STORAGE_KEY_DRAFT);
      setApplicationData({
        ...defaultEmptyApplication,
        id: Math.random().toString(36).substring(2, 9),
        protocolNumber: generateProtocolNumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setCurrentStep(1);
    }
  };

  // Submit Application
  const handleSubmitProposal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const finalRecord: TenantApplication = {
        ...applicationData,
        id: applicationData.id || Math.random().toString(36).substring(2, 9),
        protocolNumber: applicationData.protocolNumber || generateProtocolNumber(),
        status: 'pendente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAllApplications((prev) => [finalRecord, ...prev.filter((a) => a.id !== finalRecord.id)]);
      setSubmittedApplication(finalRecord);
      setIsSubmitting(false);

      // Clean draft
      localStorage.removeItem(STORAGE_KEY_DRAFT);
    }, 700);
  };

  const handleUpdateApplicationFromAdmin = (id: string, updates: Partial<TenantApplication>) => {
    setAllApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app))
    );
  };

  const stepsList = [
    { num: 1, label: 'Dados do Titular', icon: User },
    { num: 2, label: 'Renda & Trabalho', icon: Briefcase },
    { num: 3, label: 'Moradores & Pet', icon: Users },
    { num: 4, label: 'Garantia', icon: ShieldCheck },
    { num: 5, label: 'Documentos', icon: FileText },
    { num: 6, label: 'Revisão & Assinatura', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="bg-slate-900 text-white sticky top-0 z-40 shadow-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">Meu Aluguel</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  Itaquera · SP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Cadastro e Proposta Online · Aluguel R$ 1.250/mês (OLX 1524691859)
              </p>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isAdminView && (
              <button
                type="button"
                onClick={handleFillSample}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Preencher automaticamente com dados válidos de teste"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Preencher com</span> Exemplo
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAdminView(!isAdminView)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                isAdminView
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isAdminView ? 'Ver Ficha do Candidato' : 'Painel do Proprietário'}</span>
              {allApplications.length > 0 && !isAdminView && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-900 font-extrabold">
                  {allApplications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {isAdminView ? (
          /* Landlord Admin Dashboard */
          <AdminDashboard
            applications={allApplications}
            onUpdateApplication={handleUpdateApplicationFromAdmin}
            onOpenDossier={(app) => setDossierApplication(app)}
            onExitAdmin={() => setIsAdminView(false)}
          />
        ) : (
          /* Tenant View */
          <>
            {/* Header info */}
            <HouseHeader onStartApplication={scrollToForm} />

            {/* Gallery and simulator */}
            <div className="grid grid-cols-1 gap-8">
              <HouseGallery />
              <FinancialSimulator />
            </div>

            {/* Application Form Section */}
            <section
              ref={formSectionRef}
              id="formulario-aluguel"
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs scroll-mt-20"
            >
              {/* Form Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                      Ficha Cadastral Oficial
                    </span>
                    <span className="text-xs text-slate-400">· Protocolo: {applicationData.protocolNumber}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Proposta de Locação da Casa em Itaquera
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Preencha suas informações para que o proprietário analise seus documentos e aprove o contrato de aluguel.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpar campos
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-6 border-b border-slate-100">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {stepsList.map((step) => {
                    const isPassed = currentStep > step.num;
                    const isCurrent = currentStep === step.num;
                    const Icon = step.icon;

                    return (
                      <button
                        key={step.num}
                        type="button"
                        onClick={() => setCurrentStep(step.num)}
                        className={`text-left p-2.5 rounded-xl transition flex flex-col gap-1 cursor-pointer border ${
                          isCurrent
                            ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20'
                            : isPassed
                            ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            : 'bg-white border-transparent text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : isPassed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isPassed ? '✓' : step.num}
                          </span>
                          <Icon
                            className={`w-3.5 h-3.5 ${
                              isCurrent
                                ? 'text-emerald-700'
                                : isPassed
                                ? 'text-emerald-600'
                                : 'text-slate-300'
                            }`}
                          />
                        </div>
                        <div
                          className={`text-xs font-semibold truncate ${
                            isCurrent
                              ? 'text-slate-900'
                              : isPassed
                              ? 'text-slate-700'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Forms */}
              <div className="pt-6">
                {currentStep === 1 && (
                  <Step1Personal
                    data={applicationData}
                    onChange={updateApplication}
                    onNext={handleNextStep}
                  />
                )}

                {currentStep === 2 && (
                  <Step2Income
                    data={applicationData}
                    onChange={updateApplication}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}

                {currentStep === 3 && (
                  <Step3Household
                    data={applicationData}
                    onChange={updateApplication}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}

                {currentStep === 4 && (
                  <Step4Guarantee
                    data={applicationData}
                    onChange={updateApplication}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}

                {currentStep === 5 && (
                  <Step5Documents
                    data={applicationData}
                    onChange={updateApplication}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                  />
                )}

                {currentStep === 6 && (
                  <Step6ReviewSign
                    data={applicationData}
                    onChange={updateApplication}
                    onSubmit={handleSubmitProposal}
                    onPrev={handlePrevStep}
                    onJumpToStep={(step) => setCurrentStep(step)}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating toast notification when sample data is loaded */}
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Ficha preenchida com dados reais de exemplo com sucesso!</span>
        </div>
      )}

      {/* Submission Success Modal */}
      {submittedApplication && (
        <SubmissionSuccessModal
          application={submittedApplication}
          onClose={() => setSubmittedApplication(null)}
          onOpenDossier={() => setDossierApplication(submittedApplication)}
        />
      )}

      {/* Dossier Modal */}
      {dossierApplication && (
        <DossierModal
          application={dossierApplication}
          onClose={() => setDossierApplication(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Meu Aluguel</span>
            <span>·</span>
            <span>Alugo casa em Itaquera · R$ 1.250/mês</span>
            <span>·</span>
            <a
              href={HOUSE_DATA.olxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline flex items-center gap-1"
            >
              OLX Anúncio 1524691859 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Lei do Inquilinato nº 8.245/91</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Lock className="w-3 h-3 text-emerald-600" /> Privacidade & LGPD Respeitada
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
