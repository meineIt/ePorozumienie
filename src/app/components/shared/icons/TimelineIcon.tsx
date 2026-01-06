import React from 'react';
import { IconProps } from './IconProps';

export type TimelineEventType = 'creation' | 'party-added' | 'party-joined' | 'analysis' | 'proposal' | 'acceptance';

interface TimelineIconProps extends IconProps {
  type: TimelineEventType;
}

/**
 * Komponent ikony dla wydarzeń w timeline sprawy
 */
export default function TimelineIcon({ type, className = "w-5 h-5" }: TimelineIconProps) {
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
    case 'creation':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      );
    case 'party-added':
    case 'party-joined':
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      );
    case 'analysis':
      return (
        <svg {...iconProps}>
          <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path>
        </svg>
      );
    case 'proposal':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" x2="8" y1="13" y2="13"></line>
          <line x1="16" x2="8" y1="17" y2="17"></line>
        </svg>
      );
    case 'acceptance':
      return (
        <svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      );
  }
}

