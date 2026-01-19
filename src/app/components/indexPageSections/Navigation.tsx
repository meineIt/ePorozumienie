'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isRulesPage = pathname === '/rules';
  const isPrivacyPolicyPage = pathname === '/privacy-policy';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl bg-white/90 border-b border-[var(--glass-turquoise-border)] shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl md:text-3xl font-bold text-[#0A2463] tracking-tight transition-all duration-200 hover:scale-105"
              >
                e-Porozumienie
              </Link>
            </div>
            {isHomePage && (
              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                <a
                  href="#jak-to-dziala"
                  className="px-5 py-2.5 rounded-2xl text-gray-700 hover:text-[var(--turquoise)] font-semibold text-base transition-all duration-200 hover:bg-[var(--glass-turquoise-accent)] active:scale-95"
                >
                  Jak to działa
                </a>
                <a
                  href="#korzysci"
                  className="px-5 py-2.5 rounded-2xl text-gray-700 hover:text-[var(--turquoise)] font-semibold text-base transition-all duration-200 hover:bg-[var(--glass-turquoise-accent)] active:scale-95"
                >
                  Korzyści
                </a>
                <a
                  href="#kredyty-frankowe"
                  className="px-5 py-2.5 rounded-2xl text-gray-700 hover:text-[var(--turquoise)] font-semibold text-base transition-all duration-200 hover:bg-[var(--glass-turquoise-accent)] active:scale-95"
                >
                  Kredyty frankowe
                </a>
                <a
                  href="#cennik"
                  className="px-5 py-2.5 rounded-2xl text-gray-700 hover:text-[var(--turquoise)] font-semibold text-base transition-all duration-200 hover:bg-[var(--glass-turquoise-accent)] active:scale-95"
                >
                  Model biznesowy
                </a>
                <a
                  href="#zespol"
                  className="px-5 py-2.5 rounded-2xl text-gray-700 hover:text-[var(--turquoise)] font-semibold text-base transition-all duration-200 hover:bg-[var(--glass-turquoise-accent)] active:scale-95"
                >
                  Zespół
                </a>
              </div>
            )}
            {(isHomePage || isRulesPage || isPrivacyPolicyPage) && (
              <div>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 bg-linear-to-br from-[#0A2463] to-[#051740] text-white font-bold rounded-3xl text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:shadow-[var(--turquoise)]/20 active:scale-95 border border-[var(--turquoise)]/20"
                >
                  Logowanie
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

