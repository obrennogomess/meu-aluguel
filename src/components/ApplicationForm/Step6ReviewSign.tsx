import React, { useRef, useState, useEffect } from 'react';
import { TenantApplication } from '../../types/rental';
import { HOUSE_DATA } from '../../data/houseData';
import { formatCurrency } from '../../utils/masks';
import { 
  FileCheck, 
  User, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  FolderCheck, 
  PenTool, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface Step6Props {
  data: TenantApplication;
  onChange: (updates: Partial<TenantApplication>) => void;
  onSubmit: () => void;
  onPrev: () => void;
  onJumpToStep: (stepNumber: number) => void;
  isSubmitting: boolean;
}

export const Step6ReviewSign: React.FC<Step6Props> = ({
  data,
  onChange,
  onSubmit,
  onPrev,
  onJumpToStep,
  isSubmitting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [termError, setTermError] = useState('');

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If signature already exists
    if (data.signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = data.signatureDataUrl;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange({ signatureDataUrl: dataUrl });
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    onChange({ signatureDataUrl: undefined });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.declaredAccurate || !data.authorizedCreditCheck) {
      setTermError('Você precisa aceitar os dois termos legais antes de finalizar a proposta.');
      return;
    }
    setTermError('');
    onSubmit();
  };

  const totalHouseholdIncome =
    (data.monthlyGrossIncome || 0) +
    (data.additionalIncome || 0) +
    data.members.reduce((acc, m) => acc + (m.hasIncome ? m.monthlyIncome || 0 : 0), 0);

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          Passo 6: Revisão dos Dados & Assinatura Digital
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Revise todas as informações antes de transmitir sua proposta formal de locação.
        </p>
      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Titular & Contato */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b pb-2">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <User className="w-4 h-4" /> Titular do Aluguel
            </span>
            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              Editar
            </button>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div>
              <strong className="text-slate-800">Nome:</strong> {data.fullName || 'Não informado'}
            </div>
            <div>
              <strong className="text-slate-800">CPF:</strong> {data.cpf || 'Não informado'} |{' '}
              <strong className="text-slate-800">RG:</strong> {data.rg} ({data.rgIssuer})
            </div>
            <div>
              <strong className="text-slate-800">WhatsApp:</strong> {data.phone || 'Não informado'}
            </div>
            <div>
              <strong className="text-slate-800">E-mail:</strong> {data.email || 'Não informado'}
            </div>
            <div>
              <strong className="text-slate-800">Endereço Atual:</strong>{' '}
              {data.currentAddress.street}, {data.currentAddress.number}{' '}
              {data.currentAddress.complement && `(${data.currentAddress.complement})`} -{' '}
              {data.currentAddress.neighborhood}, {data.currentAddress.city}/{data.currentAddress.state}
            </div>
          </div>
        </div>

        {/* Renda & Ocupação */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b pb-2">
            <span className="flex items-center gap-1.5 text-blue-800">
              <Briefcase className="w-4 h-4" /> Renda & Atividade
            </span>
            <button
              type="button"
              onClick={() => onJumpToStep(2)}
              className="text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              Editar
            </button>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div>
              <strong className="text-slate-800">Ocupação:</strong> {data.occupation} ({data.employmentType.toUpperCase()})
            </div>
            <div>
              <strong className="text-slate-800">Empresa:</strong> {data.companyName} ({data.employmentDuration})
            </div>
            <div>
              <strong className="text-slate-800">Renda do Titular:</strong> {formatCurrency(data.monthlyGrossIncome || 0)}
            </div>
            <div>
              <strong className="text-slate-800">Renda Familiar Total:</strong>{' '}
              <span className="font-bold text-emerald-700">{formatCurrency(totalHouseholdIncome)}</span>
            </div>
            <div>
              <strong className="text-slate-800">Restrição Cadastral:</strong>{' '}
              {data.hasCreditRestriction ? 'Sim (em regularização)' : 'Não possui restrições'}
            </div>
          </div>
        </div>

        {/* Moradores & Perfil */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b pb-2">
            <span className="flex items-center gap-1.5 text-purple-800">
              <Users className="w-4 h-4" /> Família & Moradores
            </span>
            <button
              type="button"
              onClick={() => onJumpToStep(3)}
              className="text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              Editar
            </button>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div>
              <strong className="text-slate-800">Total de Moradores:</strong> {data.members.length + 1} pessoa(s)
            </div>
            <div>
              <strong className="text-slate-800">Animais de Estimação:</strong>{' '}
              {data.hasPets ? `Sim (${data.petDetails})` : 'Não possui'}
            </div>
            <div>
              <strong className="text-slate-800">Uso da Garagem:</strong>{' '}
              {data.hasVehicle ? `Sim (${data.vehicleDetails})` : 'Não usará veículo'}
            </div>
            <div>
              <strong className="text-slate-800">Previsão de Mudança:</strong> {data.intendedMoveDate}
            </div>
          </div>
        </div>

        {/* Garantia & Documentos */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b pb-2">
            <span className="flex items-center gap-1.5 text-amber-800">
              <ShieldCheck className="w-4 h-4" /> Garantia & Documentos
            </span>
            <button
              type="button"
              onClick={() => onJumpToStep(4)}
              className="text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              Editar
            </button>
          </div>
          <div className="text-xs space-y-1 text-slate-600">
            <div>
              <strong className="text-slate-800">Garantia Selecionada:</strong>{' '}
              <span className="capitalize font-semibold text-slate-900">
                {data.guaranteeType.replace('_', ' ')}
              </span>
            </div>
            <div>
              <strong className="text-slate-800">Documentos Anexados:</strong> {data.documents.length} arquivo(s)
            </div>
            {data.proposalNotes && (
              <div className="truncate">
                <strong className="text-slate-800">Recado ao locador:</strong> "{data.proposalNotes}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legal terms checkboxes */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={data.declaredAccurate}
            onChange={(e) => onChange({ declaredAccurate: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded text-emerald-600 accent-emerald-600 shrink-0"
          />
          <span className="text-slate-700 leading-relaxed">
            <strong>Declaração de Veracidade:</strong> Declaro sob as penas da lei que todas as informações e dados preenchidos nesta proposta cadastral são exatos, autênticos e verdadeiros, respondendo civil e criminalmente por qualquer falsidade.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={data.authorizedCreditCheck}
            onChange={(e) => onChange({ authorizedCreditCheck: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded text-emerald-600 accent-emerald-600 shrink-0"
          />
          <span className="text-slate-700 leading-relaxed">
            <strong>Autorização LGPD & Análise de Crédito:</strong> Autorizo expressamente o proprietário e/ou imobiliária responsável a realizar as consultas cadastrais, de crédito e confirmação de dados para fins exclusivos de análise desta proposta de locação da casa em Itaquera.
          </span>
        </label>

        {termError && (
          <p className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-4 h-4" /> {termError}
          </p>
        )}
      </div>

      {/* Signature Pad */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-emerald-600" />
            Assinatura Digital do Candidato (Opcional, mas Recomendado)
          </label>
          {hasDrawn && (
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpar Assinatura
            </button>
          )}
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white p-2 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-32 bg-slate-50/50 rounded-lg cursor-crosshair touch-none"
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400">
              Desenhe sua assinatura aqui usando o mouse ou o dedo na tela
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-400 text-center">
          Sua assinatura será vinculada digitalmente ao dossiê de proposta e protocolo de locação.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para Documentos
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Transmitindo Proposta...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Concluir e Enviar Minha Proposta de Aluguel</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
