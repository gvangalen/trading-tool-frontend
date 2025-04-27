'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/setups', label: 'Setups' },
    { href: '/strategies', label: 'Strategies' },
    { href: '/market', label: 'Market' },
    { href: '/macro', label: 'Macro' },
    { href: '/technical', label: 'Technical' },
    { href: '/report', label: 'Report' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          Trading Tool
        </div>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition ${
                pathname.startsWith(link.href)
                  ? 'font-bold text-blue-600'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
