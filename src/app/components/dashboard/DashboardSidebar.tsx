'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardSidebarProps {
  user: User | null;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Pulpit',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
      ),
    },
    {
      href: '/dashboard/documents',
      label: 'Dokumenty',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" x2="8" y1="13" y2="13"></line>
          <line x1="16" x2="8" y1="17" y2="17"></line>
          <line x1="10" x2="8" y1="9" y2="9"></line>
        </svg>
      ),
    },
    {
      href: '/dashboard/',
      label: 'Statystyki',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
          <path d="M21.18 8.02A10 10 0 0 0 12 2v10h10c0-1.41-.34-2.73-.9-3.91"></path>
        </svg>
      ),
    },
    {
      href: '/dashboard/contactForm',
      label: 'Napisz do nas',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
  ];

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[230px] bg-white border-r border-gray-200 z-40 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-[70px] flex items-center px-6 border-b border-gray-200">
        <Link href="/dashboard" className="text-2xl font-bold text-[#0A2463] hover:text-[#051740] font-['Space_Grotesk']">
          e-<span className="font-normal">Porozumienie</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${
                    isActive
                      ? 'bg-[#BBDEFB] text-[#0A2463] border-l-[3px] border-[#0A2463]'
                      : 'text-[#616161] hover:bg-[#F5F5F5] hover:text-[#0A2463]'
                  }`}
                >
                  <span className="mr-3 w-5 h-5 flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info Footer */}
      <div className="border-t border-gray-200 px-6 py-4">
        <Link href="/dashboard/profile" className="flex items-center mb-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-[#3E5C95] text-white flex items-center justify-center font-semibold text-sm mr-3 shrink-0">
            {getUserInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#212121] truncate leading-tight">
              {user ? `${user.firstName} ${user.lastName}` : 'Użytkownik'}
            </div>
            <div className="text-[12px] text-[#616161] truncate">{user?.email || ''}</div>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 font-medium text-sm border border-gray-200 hover:border-gray-300"
        >
          Wyloguj
        </button>
      </div>
    </aside>
  );
}