'use client';

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px]">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - zgodny ze stylem innych stron dashboardu */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#212121] leading-tight">
            Statystyki
          </h1>
        </div>

        {/* Info Card - używamy klas .card z globals.css */}
        <div className="card card-padding text-center">

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#212121] mb-4">
            Statystyki pojawią się niebawem
          </h2>

          {/* Description */}
          <p className="text-[#616161] text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            Aplikacja uczy się o Twoich preferencjach i zachowaniach, aby dostarczyć Ci najbardziej przydatne statystyki i analitykę.
          </p>

          {/* Features List */}
          <div className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-xl p-4 sm:p-6 mb-6 border border-gray-200/50">
            <p className="text-sm font-semibold text-[#212121] mb-4">
              Co będziesz mógł zobaczyć:
            </p>
            <ul className="space-y-3 text-left max-w-sm mx-auto">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[rgba(33,150,243,0.15)] rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-[#2196F3]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#616161] text-sm">Analiza Twoich spraw i postępów</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[rgba(33,150,243,0.15)] rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-[#2196F3]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#616161] text-sm">Trendy i wzorce w Twoich działaniach</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[rgba(33,150,243,0.15)] rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-[#2196F3]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#616161] text-sm">Rekomendacje i sugestie</span>
              </li>
            </ul>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-[#616161]">
            Wróć tutaj za kilka dni, aby zobaczyć swoje pierwsze statystyki!
          </p>
        </div>
      </div>
    </div>
  );
}
