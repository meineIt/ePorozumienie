import Link from 'next/link';


export default function HeroSection() {
  return (
    <header className="pt-24 md:pt-32 pb-8 md:pb-12 relative overflow-hidden">
      {/* Background with glass effect and turquoise accents */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0A2463] to-[#051740]">
        {/* Glass overlay with turquoise tint */}
        <div className="absolute inset-0 bg-linear-to-br from-[var(--glass-turquoise-bg)] to-transparent opacity-80 backdrop-blur-[1px]"></div>
        {/* Subtle turquoise contour pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,180,216,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(72,202,228,0.08),transparent_50%)]"></div>
      </div>

      {/* Content container with glass backdrop */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Glass card for main content */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-white leading-tight tracking-tight">
                e-Porozumienie
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl mb-10 md:mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
                Zawrzyj porozumienie dzięki <strong className="font-semibold text-[var(--turquoise)] drop-shadow-sm">AI</strong> w 3 dni.
                <br className="hidden md:block" />
                <span className="md:inline">Pierwsza taka platforma w </span><strong className="font-semibold text-[var(--turquoise)] drop-shadow-sm">Polsce</strong>
              </p>
              <div className="flex justify-center">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-3xl font-semibold text-base md:text-lg shadow-2xl shadow-black/20 hover:shadow-3xl hover:shadow-black/30 hover:bg-white/20 hover:border-[var(--turquoise)]/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 drop-shadow-sm">Sprawdź</span>
                  <span className="absolute inset-0 bg-linear-to-r from-[var(--turquoise)]/10 to-[var(--turquoise-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

