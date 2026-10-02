import React, { useState } from 'react';
import { HOUSE_DATA } from '../data/houseData';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Expand, 
  X, 
  MapPin, 
  Check, 
  Sparkles,
  Shield,
  Flower2,
  Car,
  Compass
} from 'lucide-react';

export const HouseGallery: React.FC = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'details' | 'location'>('photos');

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % HOUSE_DATA.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + HOUSE_DATA.images.length) % HOUSE_DATA.images.length);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('photos')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'photos'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Fotos Oficiais do Anúncio ({HOUSE_DATA.images.length} Fotos)</span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'details'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Características & Descrição</span>
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'location'
              ? 'border-emerald-600 text-emerald-800 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Localização (Itaquera)</span>
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'photos' && (
          <div className="space-y-4">
            {/* Main Image Stage */}
            <div className="relative aspect-video sm:aspect-16/9 w-full bg-slate-900 rounded-xl overflow-hidden group">
              <img
                src={HOUSE_DATA.images[activeImageIndex].url}
                alt={HOUSE_DATA.images[activeImageIndex].title}
                className="w-full h-full object-contain sm:object-cover bg-black/60 transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Gradient overlay for caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded">
                  Foto {activeImageIndex + 1} de {HOUSE_DATA.images.length}
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  {HOUSE_DATA.images[activeImageIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                  {HOUSE_DATA.images[activeImageIndex].description}
                </p>
              </div>

              {/* Controls */}
              <button
                onClick={prevImage}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextImage}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs transition cursor-pointer"
              >
                <Expand className="w-4 h-4" />
                <span>Ampliar Todas as Fotos</span>
              </button>
            </div>

            {/* Scrollable Thumbnails Strip for all 17 photos */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Galeria completa ({HOUSE_DATA.images.length} fotos reais do anúncio)</span>
                <span>Clique em qualquer foto para visualizar</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {HOUSE_DATA.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer text-left ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-600/40 shadow-xs'
                        : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1 rounded font-mono font-bold">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                Descrição Original do Anúncio (OLX #1524691859)
              </h3>
              <div className="text-sm text-slate-800 leading-relaxed font-medium bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
                <p className="whitespace-pre-line font-mono text-xs sm:text-sm">
                  {HOUSE_DATA.description}
                </p>
                <div className="mt-4 pt-3 border-t border-emerald-200/60 text-xs text-emerald-900 flex items-center justify-between">
                  <span>Valor do Aluguel: <strong>R$ 1.250 / mês</strong></span>
                  <span className="text-slate-500">Direto com o proprietário</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Composição do Imóvel
              </h3>
              <ul className="space-y-2.5">
                {HOUSE_DATA.amenities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-4">
            <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Localização: Jardim Soraia, Itaquera (São Paulo - Zona Leste)
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Casa situada no Jardim Soraia / Itaquera, com excelente acesso a condução, mercados e polos educacionais.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOUSE_DATA.nearbyHighlights.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs sm:text-sm text-slate-700">
                  <div className="w-7 h-7 rounded-md bg-white text-emerald-700 shadow-2xs flex items-center justify-center shrink-0 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-sm animate-in fade-in">
          <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full">
            <div>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                Foto {activeImageIndex + 1} de {HOUSE_DATA.images.length}
              </span>
              <h4 className="text-base font-bold">{HOUSE_DATA.images[activeImageIndex].title}</h4>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative max-w-5xl mx-auto w-full flex items-center justify-center my-auto">
            <img
              src={HOUSE_DATA.images[activeImageIndex].url}
              alt={HOUSE_DATA.images[activeImageIndex].title}
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
            />

            <button
              onClick={prevImage}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Quick thumbnails strip inside modal */}
          <div className="max-w-4xl mx-auto w-full flex gap-2 overflow-x-auto py-2">
            {HOUSE_DATA.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`relative w-16 aspect-video shrink-0 rounded overflow-hidden border transition cursor-pointer ${
                  activeImageIndex === i ? 'border-emerald-500 scale-105' : 'border-white/20 opacity-50'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
