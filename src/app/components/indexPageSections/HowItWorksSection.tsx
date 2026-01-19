export default function HowItWorksSection() {
  return (
    <section id="jak-to-dziala" className="py-8 md:py-12 relative">
      {/* Background with glass effect and turquoise accents */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[var(--glass-turquoise-bg)] opacity-15"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 md:mb-20 text-gray-900 tracking-tight">
          Jak działa <span className="text-[var(--turquoise)] drop-shadow-sm">e-Porozumienie</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          <div className="group backdrop-blur-sm bg-white/70 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--glass-turquoise-border)] hover:border-[var(--turquoise)]/30 hover:-translate-y-1 hover:bg-white/80 relative">
            <div className="w-16 h-16 bg-linear-to-br from-[#0A2463] to-[#051740] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-[#0A2463]/30 group-hover:scale-110 group-hover:shadow-[var(--turquoise)]/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[var(--turquoise)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">1</div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Rejestracja i weryfikacja
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Załóż konto, zweryfikuj tożsamość przez <strong className="font-semibold text-gray-900">Profil Zaufany</strong> i wgraj
              dokumenty, które zostaną <strong className="font-semibold text-gray-900">automatycznie zweryfikowane</strong> pod kątem
              autentyczności.
            </p>
          </div>
          <div className="group backdrop-blur-sm bg-white/70 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--glass-turquoise-border)] hover:border-[var(--turquoise)]/30 hover:-translate-y-1 hover:bg-white/80 relative">
            <div className="w-16 h-16 bg-linear-to-br from-[#0A2463] to-[#051740] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-[#0A2463]/30 group-hover:scale-110 group-hover:shadow-[var(--turquoise)]/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[var(--turquoise)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">2</div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-mediacja</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              <strong className="font-semibold text-gray-900">AI-mediator</strong> analizuje dokumenty, identyfikuje punkty sporne i
              proponuje kompromisowe rozwiązania zgodne z aktualnym <strong className="font-semibold text-gray-900">orzecznictwem</strong>.
            </p>
          </div>
          <div className="group backdrop-blur-sm bg-white/70 p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--glass-turquoise-border)] hover:border-[var(--turquoise)]/30 hover:-translate-y-1 hover:bg-white/80 relative">
            <div className="w-16 h-16 bg-linear-to-br from-[#0A2463] to-[#051740] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-[#0A2463]/30 group-hover:scale-110 group-hover:shadow-[var(--turquoise)]/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[var(--turquoise)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">3</div>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Porozumienie i e-podpis</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Po osiągnięciu porozumienia, system generuje gotowe porozumienie do podpisania za pomocą{' '}
              <strong className="font-semibold text-gray-900">podpisu elektronicznego</strong> bez wychodzenia z domu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

