import React from 'react';
import { IconProps } from './IconProps';

interface DocumentIconProps extends IconProps {
  category: string;
  type: string;
}

/**
 * Komponent ikony dokumentu na podstawie kategorii i typu
 */
export default function DocumentIcon({ category, type, className = "w-6 h-6" }: DocumentIconProps) {
  if (type.startsWith('image/')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }
  
  if (category === 'Umowy' || category === 'Korespondencja') {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M8 15h8" />
      </svg>
    );
  }
  
  if (category === 'Faktury') {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
      </svg>
    );
  }
  
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

