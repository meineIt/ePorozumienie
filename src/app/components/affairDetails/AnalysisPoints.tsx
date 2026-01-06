'use client';

interface AnalysisPoint {
  id: string;
  title: string;
  description: string;
}

interface AnalysisPointsProps {
  type: 'agreements' | 'negotiations' | 'disagreements';
  points: AnalysisPoint[];
}

export default function AnalysisPoints({ type, points }: AnalysisPointsProps) {
  const config = {
    agreements: {
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ),
      iconBg: 'bg-[rgba(76,175,80,0.1)]',
      iconColor: 'text-[#4CAF50]',
      emptyTitle: 'Brak punktów zgodnych',
      emptyDescription: 'Punkty zgodne będą wyświetlane tutaj po analizie AI.',
    },
    negotiations: {
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      ),
      iconBg: 'bg-[rgba(33,150,243,0.1)]',
      iconColor: 'text-[#2196F3]',
      emptyTitle: 'Brak punktów do negocjacji',
      emptyDescription: 'Punkty do negocjacji będą wyświetlane tutaj po analizie AI.',
    },
    disagreements: {
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ),
      iconBg: 'bg-[rgba(255,152,0,0.1)]',
      iconColor: 'text-[#FF9800]',
      emptyTitle: 'Brak rozbieżności',
      emptyDescription: 'Rozbieżności będą wyświetlane tutaj po analizie AI.',
    },
  };

  const currentConfig = config[type];

  if (points.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${currentConfig.iconBg} flex items-center justify-center ${currentConfig.iconColor}`}>
          {currentConfig.icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[#212121]">{currentConfig.emptyTitle}</h3>
        <p className="text-[#616161] max-w-md mx-auto">{currentConfig.emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {points.map((point) => (
        <div
          key={point.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#0A2463]"
        >
          <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-full ${currentConfig.iconBg} flex items-center justify-center shrink-0 ${currentConfig.iconColor}`}>
              {currentConfig.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#212121] mb-2">{point.title}</h4>
              <p className="text-[#616161] text-sm leading-relaxed">{point.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

