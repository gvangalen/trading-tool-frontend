'use client';

import Link from 'next/link';

export default function DashboardHeader() {
  return (
    <nav className="bg-gray-800 p-4 text-center space-x-8">
      <Link href="/dashboard" className="text-white font-bold hover:text-green-400">
        📊 Dashboard
      </Link>
      <Link href="/report" className="text-white font-bold hover:text-blue-400">
        📄 Dagrapport
      </Link>
    </nav>
  );
}
