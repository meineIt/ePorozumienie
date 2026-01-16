import { CTASectionProps } from '@/lib/types';

export default function CTASection({ onCTAClick }: CTASectionProps) {
  return (
    <section className="py-20 md:py-28 element-with-pattern relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-white tracking-tight">
          Zainwestuj w przyszłość mediacji online
        </h2>
        <p className="text-xl md:text-2xl mb-12 md:mb-16 text-white/90 max-w-4xl mx-auto leading-relaxed">
          e-Porozumienie to <strong className="font-semibold text-white">innowacyjne rozwiązanie</strong> z potencjałem transformacji
          rynku mediacji w Polsce i Europie. Nasza strategia rozwoju zakłada:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 shadow-xl">
            <h3 className="text-white font-bold mb-3 text-2xl">6 miesięcy</h3>
            <p className="text-white/90 leading-relaxed text-base">
              <strong className="font-semibold text-white">MVP</strong>, pilotaż, 50 mediacji, partnerstwa z 3 bankami i 5 kancelariami
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 shadow-xl">
            <h3 className="text-white font-bold mb-3 text-2xl">12 miesięcy</h3>
            <p className="text-white/90 leading-relaxed text-base">
              <strong className="font-semibold text-white">Komercjalizacja</strong>, 200 mediacji/mies., pierwsze płatne wdrożenia B2B
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 shadow-xl">
            <h3 className="text-white font-bold mb-3 text-2xl">24 miesiące</h3>
            <p className="text-white/90 leading-relaxed text-base">
              <strong className="font-semibold text-white">2000+ mediacji/mies.</strong>, ekspansja na rynki zagraniczne (CEE, UE)
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={onCTAClick}
            className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 bg-white text-blue-800 rounded-3xl font-semibold text-lg md:text-xl shadow-2xl shadow-black/20 hover:shadow-3xl hover:shadow-black/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Odbierz zniżkę</span>
            <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </section>
  );
}

