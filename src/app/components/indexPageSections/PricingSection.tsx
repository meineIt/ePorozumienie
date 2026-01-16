export default function PricingSection() {
  return (
    <section id="cennik" className="py-20 md:py-24 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 md:mb-20 text-gray-900 tracking-tight">
          Model biznesowy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-1">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Klient indywidualny</h3>
              <div className="text-5xl md:text-6xl font-bold text-blue-700 mb-2">99 zł</div>
              <p className="text-gray-600 text-lg">za sprawę</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Mediacja online w sprawie frankowej</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Wsparcie AI-mediatora</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Generowanie dokumentów</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">E-podpis dokumentów</span>
              </li>
            </ul>
          </div>
          <div className="relative element-with-pattern p-8 md:p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-[#0A2463]/30 hover:-translate-y-1 transform md:scale-105">
            <div className="text-center mb-8 relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Kancelarie prawne</h3>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">od 299 zł</div>
              <p className="text-[#0A2463]/80 text-lg">miesięcznie</p>
            </div>
            <ul className="space-y-4 mb-8 relative z-10">
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-white/30 transition-colors border border-white/30">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white text-base leading-relaxed">Abonament na obsługę wielu spraw</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-white/30 transition-colors border border-white/30">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white text-base leading-relaxed">Panel zarządzania sprawami</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-white/30 transition-colors border border-white/30">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white text-base leading-relaxed">Zaawansowana analityka</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-white/30 transition-colors border border-white/30">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white text-base leading-relaxed">Priorytetowe wsparcie</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-white/30 transition-colors border border-white/30">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-white text-base leading-relaxed">Branding kancelarii</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-1">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Instytucje</h3>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-700 mb-2 wrap-break-words">Skontaktuj się</div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Licencje dla banków i instytucji</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Integracja z systemami wewnętrznymi</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Dedykowane rozwiązania</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 12a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Wsparcie 24/7</span>
              </li>
              <li className="flex items-start group">
                <div className="shrink-0 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 12a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-gray-700 text-base leading-relaxed">Raportowanie i compliance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

