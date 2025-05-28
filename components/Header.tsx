'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Upload, List } from 'lucide-react';

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            CV Parser
          </Link>
          
          <nav className="flex gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Link>
            <Link
              href="/resumes"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                pathname === '/resumes'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
              View Resumes
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}; 