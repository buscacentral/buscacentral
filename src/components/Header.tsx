import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">Busca</span>
            <span className="text-2xl font-bold text-gray-900">Central</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/documentos/gerador-cpf" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Documentos
            </Link>
            <Link href="/localizacao/busca-cep" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Localização
            </Link>
            <Link href="#" className="text-gray-400 cursor-not-allowed font-medium">
              Financeiro
            </Link>
            <Link href="#" className="text-gray-400 cursor-not-allowed font-medium">
              Utilidades
            </Link>
          </nav>

          <button className="md:hidden p-2">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
