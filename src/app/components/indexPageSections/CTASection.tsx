import { CTASectionProps } from '@/lib/types';

export default function CTASection({ onCTAClick }: CTASectionProps) {
  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      {/* Enhanced background with glass effect and turquoise accents */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0A2463] to-[#051740]">
        <div className="absolute inset-0 bg-[var(--glass-turquoise-bg)] opacity-60 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,var(--turquoise),transparent_60%),radial-gradient(circle_at_20%_80%,var(--turquoise-accent),transparent_50%),radial-gradient(circle_at_80%_80%,var(--turquoise-accent),transparent_50%)] opacity-15"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-white tracking-tight drop-shadow-lg">
          Zainwestuj w przyszłość <span className="text-[var(--turquoise)] drop-shadow-sm">mediacji online</span>
        </h2>
        <p className="text-xl md:text-2xl mb-12 md:mb-16 text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-sm">
          e-Porozumienie to <strong className="font-semibold text-[var(--turquoise)]">innowacyjne rozwiązanie</strong> z potencjałem transformacji
          rynku mediacji w Polsce i Europie. Nasza strategia rozwoju zakłada:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-8 rounded-3xl border border-[var(--glass-turquoise-border)] hover:bg-white/15 hover:border-[var(--turquoise)]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[var(--turquoise)]/10">
            <h3 className="text-[var(--turquoise)] font-bold mb-3 text-2xl drop-shadow-sm">6 miesięcy</h3>
            <p className="text-white/90 leading-relaxed text-base">
              <strong className="font-semibold text-white">MVP</strong>, pilotaż, 50 mediacji, partnerstwa z 3 bankami i 5 kancelariami
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-8 rounded-3xl border border-[var(--glass-turquoise-border)] hover:bg-white/15 hover:border-[var(--turquoise)]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[var(--turquoise)]/10">
            <h3 className="text-[var(--turquoise)] font-bold mb-3 text-2xl drop-shadow-sm">12 miesięcy</h3>
            <p className="text-white/90 leading-relaxed text-base">
              <strong className="font-semibold text-white">Komercjalizacja</strong>, 200 mediacji/mies., pierwsze płatne wdrożenia B2B
            </p>
          </div>
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-8 rounded-3xl border border-[var(--glass-turquoise-border)] hover:bg-white/15 hover:border-[var(--turquoise)]/40 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-[var(--turquoise)]/10">
            <h3 className="text-[var(--turquoise)] font-bold mb-3 text-2xl drop-shadow-sm">24 miesiące</h3>
            <p className="text-white/90 leading-relaxed text-base">
              <strong className="font-semibold text-white">2000+ mediacji/mies.</strong>, ekspansja na rynki zagraniczne (CEE, UE)
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={onCTAClick}
            className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-3xl font-semibold text-lg md:text-xl shadow-2xl shadow-black/20 hover:shadow-3xl hover:shadow-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/50 hover:bg-white/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 drop-shadow-sm">Odbierz zniżkę</span>
            <span className="absolute inset-0 bg-linear-to-r from-[var(--turquoise)]/20 to-[var(--turquoise-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></span>
          </button>
        </div>
      </div>
    </section>
  );
}

