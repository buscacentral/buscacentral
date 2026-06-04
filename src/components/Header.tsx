'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <Image src="/logo.png" alt="BuscaCentral" width={220} height={48} priority />
          </Link>
          
          <nav className="hidden md:flex space-x-10">
            <Link href="/documentos" className="text-gray-700 hover:text-blue-700 font-extrabold text-xl transition-colors">
              Documentos
            </Link>
            <Link href="/localizacao" className="text-gray-700 hover:text-blue-700 font-extrabold text-xl transition-colors">
              Localização
            </Link>
            <Link href="/financeiro" className="text-gray-700 hover:text-blue-700 font-extrabold text-xl transition-colors">
              Financeiro
            </Link>
            <Link href="/utilidades" className="text-gray-700 hover:text-blue-700 font-extrabold text-xl transition-colors">
              Utilidades
            </Link>
          </nav>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Menu"
            style={{ touchAction: 'manipulation' }}
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2">
            <Link 
              href="/documentos" 
              onClick={() => setMenuOpen(false)}
              className="block py-4 px-5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-semibold text-lg"
            >
              Documentos
            </Link>
            <Link 
              href="/localizacao" 
              onClick={() => setMenuOpen(false)}
              className="block py-4 px-5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-semibold text-lg"
            >
              Localização
            </Link>
            <Link 
              href="/financeiro" 
              onClick={() => setMenuOpen(false)}
              className="block py-4 px-5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-semibold text-lg"
            >
              Financeiro
            </Link>
            <Link 
              href="/utilidades" 
              onClick={() => setMenuOpen(false)}
              className="block py-4 px-5 text-gray-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-semibold text-lg"
            >
              Utilidades
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
