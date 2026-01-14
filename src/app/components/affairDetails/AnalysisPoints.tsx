'use client';

import AnalysisIcon, { AnalysisType } from '../shared/icons/AnalysisIcon';

interface AnalysisPoint {
  id: string;
  title: string;
  description: string;
}

interface AnalysisPointsProps {
  type: AnalysisType;
  points: AnalysisPoint[];
}

export default function AnalysisPoints({ type, points }: AnalysisPointsProps) {
  const config = {
    agreements: {
      icon: <AnalysisIcon type="agreements" className="w-4 h-4" />,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      emptyTitle: 'Brak punktów zgodnych',
      emptyDescription: 'Punkty zgodne będą wyświetlane tutaj po analizie AI.',
    },
    negotiations: {
      icon: <AnalysisIcon type="negotiations" className="w-4 h-4" />,
      iconBg: 'bg-[rgba(33,150,243,0.1)]',
      iconColor: 'text-[#2196F3]',
      emptyTitle: 'Brak punktów do negocjacji',
      emptyDescription: 'Punkty do negocjacji będą wyświetlane tutaj po analizie AI.',
    },
    disagreements: {
      icon: <AnalysisIcon type="disagreements" className="w-4 h-4" />,
      iconBg: 'bg-[rgba(255,152,0,0.1)]',
      iconColor: 'text-[#FF9800]',
      emptyTitle: 'Brak rozbieżności',
      emptyDescription: 'Rozbieżności będą wyświetlane tutaj po analizie AI.',
    },
  };

  const currentConfig = config[type];

  if (points.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl ${currentConfig.iconBg} flex items-center justify-center ${currentConfig.iconColor} shadow-sm`}>
          <div className="scale-110">
            {currentConfig.icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[#212121]">{currentConfig.emptyTitle}</h3>
        <p className="text-[#616161] max-w-md mx-auto text-sm leading-relaxed">{currentConfig.emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {points.map((point) => (
        <div
          key={point.id}
          className="bg-gradient-to-br from-white to-[#F5F5F7] rounded-lg shadow-sm border border-gray-200/50 p-4 hover:shadow-md hover:border-[#3E5C95]/30 transition-all duration-200 border-l-4 border-l-[#0A2463]"
        >
          <div className="flex gap-3">
            <div className={`w-10 h-10 rounded-lg ${currentConfig.iconBg} flex items-center justify-center shrink-0 ${currentConfig.iconColor} shadow-sm`}>
              {currentConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[#212121] mb-2 text-base">{point.title}</h4>
              <div className="bg-white rounded-lg p-3 border border-gray-200/50">
                <p className="text-[#616161] text-sm leading-relaxed whitespace-pre-wrap">{point.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

