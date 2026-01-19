export default function StatsSection() {
  return (
    <section className="py-8 md:py-12 relative">
      {/* Background with glass effect and turquoise accents */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-[var(--glass-turquoise-bg)] opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--glass-turquoise-accent),transparent_70%)] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          <div className="group backdrop-blur-sm bg-white/60 p-8 md:p-10 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--glass-turquoise-border)] hover:border-[var(--turquoise)]/40 hover:-translate-y-1 hover:bg-white/70">
            <h3 className="text-5xl md:text-6xl font-bold text-[var(--turquoise)] mb-3 tracking-tight drop-shadow-sm">18 mln+</h3>
            <p className="text-gray-700 text-lg leading-relaxed">spraw sądowych rocznie w Polsce</p>
          </div>
          <div className="group backdrop-blur-sm bg-white/60 p-8 md:p-10 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--glass-turquoise-border)] hover:border-[var(--turquoise)]/40 hover:-translate-y-1 hover:bg-white/70">
            <h3 className="text-5xl md:text-6xl font-bold text-[var(--turquoise)] mb-3 tracking-tight drop-shadow-sm">72h</h3>
            <p className="text-gray-700 text-lg leading-relaxed">zamiast 72 tygodni oczekiwania</p>
          </div>
          <div className="group backdrop-blur-sm bg-white/60 p-8 md:p-10 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--glass-turquoise-border)] hover:border-[var(--turquoise)]/40 hover:-translate-y-1 hover:bg-white/70">
            <h3 className="text-5xl md:text-6xl font-bold text-[var(--turquoise)] mb-3 tracking-tight drop-shadow-sm">90 000+</h3>
            <p className="text-gray-700 text-lg leading-relaxed">nowych pozwów frankowych w 2024</p>
          </div>
        </div>
      </div>
    </section>
  );
}

