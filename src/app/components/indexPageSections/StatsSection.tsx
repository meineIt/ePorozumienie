export default function StatsSection() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          <div className="group bg-linear-to-br from-[#0A2463]/5 to-[#0A2463]/10 p-8 md:p-10 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#0A2463]/20 hover:-translate-y-1">
            <h3 className="text-5xl md:text-6xl font-bold text-blue-800 mb-3 tracking-tight">18 mln+</h3>
            <p className="text-gray-700 text-lg leading-relaxed">spraw sądowych rocznie w Polsce</p>
          </div>
          <div className="group bg-linear-to-br from-[#0A2463]/5 to-[#0A2463]/10 p-8 md:p-10 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#0A2463]/20 hover:-translate-y-1">
            <h3 className="text-5xl md:text-6xl font-bold text-blue-800 mb-3 tracking-tight">72h</h3>
            <p className="text-gray-700 text-lg leading-relaxed">zamiast 72 tygodni oczekiwania</p>
          </div>
          <div className="group bg-linear-to-br from-[#0A2463]/5 to-[#0A2463]/10 p-8 md:p-10 rounded-3xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#0A2463]/20 hover:-translate-y-1">
            <h3 className="text-5xl md:text-6xl font-bold text-blue-800 mb-3 tracking-tight">90 000+</h3>
            <p className="text-gray-700 text-lg leading-relaxed">nowych pozwów frankowych w 2024</p>
          </div>
        </div>
      </div>
    </section>
  );
}

