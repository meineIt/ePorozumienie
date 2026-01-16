import { AnalysisIconProps } from '@/lib/types';


export default function AnalysisIcon({ type, className = "w-4 h-4" }: AnalysisIconProps) {
  const iconProps = {
    className,
    fill: "none" as const,
    stroke: "currentColor" as const,
    viewBox: "0 0 24 24" as const,
    strokeWidth: "2" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case 'agreements':
      return (
        <svg {...iconProps}>
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      );
    case 'negotiations':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      );
    case 'disagreements':
      return (
        <svg {...iconProps}>
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      );
    default:
      return null;
  }
}

