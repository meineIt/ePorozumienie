'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { DashboardSidebarProps } from '@/lib/types';


export default function DashboardSidebar({ user, isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
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
      href: '/dashboard/statistics',
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
    <>
      <aside 
        className={`
          fixed left-0 top-[70px] h-[calc(100vh-70px)] w-[240px] bg-white border-r border-gray-200 z-40 flex flex-col shadow-lg
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:shadow-sm
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button for mobile - moved to top */}
        <div className="lg:hidden h-[50px] flex items-center justify-end px-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            aria-label="Zamknij menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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
                    onClick={handleLinkClick}
                    className={`
                      flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-base font-medium touch-target
                      ${isActive
                        ? 'bg-[#BBDEFB] text-[#0A2463] border-l-[3px] border-[#0A2463] shadow-sm'
                        : 'text-[#616161] hover:bg-[#F5F5F5] hover:text-[#0A2463] active:bg-[#EEEEEE]'
                      }
                    `}
                  >
                    <span className="mr-3 w-5 h-5 flex items-center justify-center shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <Link 
            href="/dashboard/profile" 
            onClick={handleLinkClick}
            className="flex items-center mb-3 hover:opacity-80 transition-opacity rounded-lg p-2 -mx-2"
          >
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
            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 font-medium text-sm border border-gray-200 hover:border-gray-300 touch-target"
          >
            Wyloguj
          </button>
        </div>
      </aside>
    </>
  );
}