'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/setup', label: 'Setups' },
    { href: '/strategy', label: 'Strategieën' },
    { href: '/market', label: 'Market' },
    { href: '/macro', label: 'Macro' },
    { href: '/technical', label: 'Technical' },
    { href: '/report', label: 'Rapport' },
    { href: '/ai', label: 'AI Advies' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="text-xl font-bold text-green-700">🧠 Trading Tool</div>
          <div className="flex space-x-2 md:space-x-4 text-sm md:text-base">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md transition ${
                  pathname.startsWith(link.href)
                    ? 'text-green-700 font-semibold bg-green-50'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-green-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
