import Link from 'next/link';
import LinksRelacionados from '@/components/LinksRelacionados';

export default function NotFound() {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="mb-12">
        <p className="text-8xl md:text-9xl font-black text-slate-200 mb-4 select-none">404</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
          Página não encontrada ou movida
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
          Atualizamos nossa estrutura para melhorar a experiência e o bem-estar dos nossos usuários.
          O conteúdo que você procura pode ter sido reorganizado. Use os links abaixo para encontrar
          o que precisa.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-base md:text-lg transition-colors active:scale-95"
        >
          Voltar para a Página Inicial
        </Link>
      </div>

      <LinksRelacionados categoria="utilidades" quantidade={6} />
    </main>
  );
}
