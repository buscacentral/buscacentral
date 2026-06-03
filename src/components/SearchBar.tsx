'use client';

import { useState } from 'react';
import Link from 'next/link';

const tools = [
  { name: 'Gerador de CPF', path: '/documentos/gerador-cpf', category: 'Documentos' },
  { name: 'Validador de CPF', path: '/documentos/validador-cpf', category: 'Documentos' },
  { name: 'Gerador de CNPJ', path: '/documentos/gerador-cnpj', category: 'Documentos' },
  { name: 'Validador de CNPJ', path: '/documentos/validador-cnpj', category: 'Documentos' },
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = query.length > 0
    ? tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Buscar ferramenta... (CPF, CNPJ, CEP...)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg
        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {filtered.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-500 mr-2">{tool.category}</span>
              <span className="font-medium">{tool.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
