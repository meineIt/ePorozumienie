export default function HowItWorksSection() {
  return (
    <section id="jak-to-dziala" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Jak działa e-Porozumienie?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md step-card">
            <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Rejestracja i weryfikacja
            </h3>
            <p className="text-gray-600">
              Załóż konto, zweryfikuj tożsamość przez <strong>Profil Zaufany</strong> i wgraj
              dokumenty, które zostaną <strong>automatycznie zweryfikowane</strong> pod kątem
              autentyczności.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md step-card">
            <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">AI-mediacja</h3>
            <p className="text-gray-600">
              <strong>AI-mediator</strong> analizuje dokumenty, identyfikuje punkty sporne i
              proponuje kompromisowe rozwiązania zgodne z aktualnym <strong>orzecznictwem</strong>.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md step-card">
            <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Porozumienie i e-podpis</h3>
            <p className="text-gray-600">
              Po osiągnięciu porozumienia, system generuje gotowe porozumienie do podpisania za pomocą
              <strong>podpisu elektronicznego</strong> bez wychodzenia z domu.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

