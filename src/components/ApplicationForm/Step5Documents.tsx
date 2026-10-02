import React, { useState } from 'react';
import { TenantApplication, AttachedDocument } from '../../types/rental';
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  ChevronLeft, 
  FileCheck, 
  Eye, 
  AlertCircle,
  FilePlus,
  HelpCircle
} from 'lucide-react';

interface Step5Props {
  data: TenantApplication;
  onChange: (updates: Partial<TenantApplication>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step5Documents: React.FC<Step5Props> = ({ data, onChange, onNext, onPrev }) => {
  const [selectedCategory, setSelectedCategory] = useState<AttachedDocument['category']>('rg_cnh');
  const [previewModalDoc, setPreviewModalDoc] = useState<AttachedDocument | null>(null);

  const categories = [
    {
      id: 'rg_cnh' as const,
      label: 'Documento de Identidade (RG ou CNH)',
      desc: 'Frente e verso nítidos do titular e do cônjuge (se casado).',
      required: true,
    },
    {
      id: 'comprovante_residencia' as const,
      label: 'Comprovante de Residência Atual',
      desc: 'Conta de consumo (luz, água, internet ou gás) recente.',
      required: true,
    },
    {
      id: 'holerite_renda' as const,
      label: 'Comprovante de Renda (3 Últimos Holerites)',
      desc: 'Ou extratos bancários dos últimos 90 dias / declaração de IR.',
      required: true,
    },
    {
      id: 'outros' as const,
      label: 'Documentos Adicionais',
      desc: 'Certidão de casamento, carteira de trabalho ou certidão de matrícula (se fiador).',
      required: false,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const catObj = categories.find((c) => c.id === selectedCategory);
    
    // Read as DataURL for preview if image/pdf
    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: AttachedDocument = {
        id: Math.random().toString(36).substring(2, 9),
        category: selectedCategory,
        title: catObj?.label || 'Documento',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.type || 'application/octet-stream',
        previewUrl: typeof reader.result === 'string' ? reader.result : undefined,
        uploadedAt: new Date().toISOString(),
      };

      onChange({
        documents: [...data.documents, newDoc],
      });
    };
    reader.readAsDataURL(file);

    // reset input
    e.target.value = '';
  };

  const addQuickMockDocument = (category: AttachedDocument['category'], name: string) => {
    const catObj = categories.find((c) => c.id === category);
    const newDoc: AttachedDocument = {
      id: Math.random().toString(36).substring(2, 9),
      category,
      title: catObj?.label || 'Documento',
      fileName: name,
      fileSize: '1.4 MB',
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
    };
    onChange({
      documents: [...data.documents, newDoc],
    });
  };

  const removeDocument = (id: string) => {
    onChange({
      documents: data.documents.filter((d) => d.id !== id),
    });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          Passo 5: Anexo de Documentos Comprobatórios
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Envie fotos ou PDFs dos seus documentos para análise cadastral da locação em Itaquera.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/20 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">Selecione e envie os arquivos</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-0.5">
            Formatos aceitos: PDF, JPG, PNG (fotos tiradas com o celular são aceitas, desde que legíveis).
          </p>
        </div>

        {/* Category selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Input file button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer transition">
            <UploadCloud className="w-4 h-4" />
            <span>Escolher Arquivo do Computador / Celular</span>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() =>
              addQuickMockDocument(
                selectedCategory,
                `documento_${selectedCategory}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '')}.pdf`
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 transition cursor-pointer"
            title="Adiciona um arquivo de teste sem precisar subir do celular"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Simular Envio Rápido</span>
          </button>
        </div>
      </div>

      {/* Checklist of required files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => {
          const docsInCategory = data.documents.filter((d) => d.category === cat.id);
          const hasUploaded = docsInCategory.length > 0;

          return (
            <div
              key={cat.id}
              className={`p-3.5 rounded-xl border text-xs transition ${
                hasUploaded
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    {hasUploaded ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{cat.label}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] pl-5.5">{cat.desc}</p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    hasUploaded
                      ? 'bg-emerald-100 text-emerald-800'
                      : cat.required
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {hasUploaded ? `${docsInCategory.length} anexo(s)` : cat.required ? 'Pendente' : 'Opcional'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Uploaded Documents List */}
      {data.documents.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Arquivos Anexados ({data.documents.length})
          </div>

          <div className="space-y-2">
            {data.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs transition"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{doc.fileName}</div>
                    <div className="text-[11px] text-slate-400">
                      {doc.title} · {doc.fileSize}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.previewUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewModalDoc(doc)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                      title="Visualizar documento"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                    title="Excluir anexo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Dúvida comum:</strong> Caso não tenha algum documento em mãos agora, você pode avançar e enviar a proposta preliminar. O proprietário poderá solicitar o envio posterior via WhatsApp.
        </span>
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
          Avançar para Revisão & Assinatura →
        </button>
      </div>

      {/* Preview Modal if doc has image preview */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 overflow-hidden">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <span className="text-xs font-bold text-slate-800 truncate">{previewModalDoc.fileName}</span>
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Fechar
              </button>
            </div>
            {previewModalDoc.previewUrl?.startsWith('data:image') ? (
              <img
                src={previewModalDoc.previewUrl}
                alt="Prévia do documento"
                className="max-h-[60vh] mx-auto object-contain rounded-lg"
              />
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Documento em formato PDF ou Binário carregado com sucesso ({previewModalDoc.fileSize}).
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
};
