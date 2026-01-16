import Link from 'next/link';


export default function HeroSection() {
  return (
    <header className="pt-32 md:pt-40 pb-24 md:pb-32 element-with-pattern relative overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-white leading-tight tracking-tight">
          e-Porozumienie
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-10 md:mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
          Zawrzyj porozumienie dzięki <strong className="font-semibold">AI</strong> w 3 dni.
          <br className="hidden md:block" />
          <span className="md:inline">Pierwsza taka platforma w </span><strong className="font-semibold">Polsce</strong> 
        </p>
        <div className="flex justify-center">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 bg-white text-blue-800 rounded-3xl font-semibold text-lg md:text-xl shadow-2xl shadow-black/20 hover:shadow-3xl hover:shadow-black/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Sprawdź</span>
            <span className="absolute inset-0 bg-linear-to-r from-[#0A2463]/10 to-[#0A2463]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  </header>
  );
}

