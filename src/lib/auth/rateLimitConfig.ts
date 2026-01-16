/**
 * Centralna konfiguracja rate limitów dla różnych typów endpointów
 */

import { RateLimitConfig } from '@/lib/types';

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Auth endpoints
  'login': {
    limit: 2,
    interval: 1 * 60 * 1000, // 1 minuta
  },
  'register': {
    limit: 2,
    interval: 5 * 60 * 1000, // 5 minut
  },
  
  // Profile endpoints
  'profile-get': {
    limit: 30,
    interval: 5 * 60 * 1000, // 5 minut
  },
  'profile-update': {
    limit: 5,
    interval: 5 * 60 * 1000, // 5 minut
  },
  
  // Affair endpoints
  'affairs-get': {
    limit: 60,
    interval: 60 * 1000, // 1 minuta
  },
  'affairs-create': {
    limit: 20,
    interval: 60 * 1000, // 1 minuta
  },
  'affairs-modify': {
    limit: 20,
    interval: 60 * 1000, // 1 minuta
  },
  'affair-get': {
    limit: 60,
    interval: 60 * 1000, // 1 minuta
  },
  
  // Document endpoints
  'documents-get': {
    limit: 30,
    interval: 60 * 1000, // 1 minuta
  },
  
  // Contact endpoints
  'contact': {
    limit: 5,
    interval: 5 * 60 * 1000, // 5 minut
  },
  
  // Discount endpoints
  'discount': {
    limit: 3,
    interval: 60 * 60 * 1000, // 60 minut
  },
};

/**
 * Pobiera konfigurację rate limitu dla danego typu endpointu
 */
export function getRateLimit(type: string): RateLimitConfig {
  const config = RATE_LIMITS[type];
  if (!config) {
    // Domyślna konfiguracja jeśli typ nie został znaleziony
    return {
      limit: 60,
      interval: 60 * 1000, // 1 minuta
    };
  }
  return config;
}
