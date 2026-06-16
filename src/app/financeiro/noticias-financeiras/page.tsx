import { Metadata } from 'next';
import NoticiasClient from './NoticiasClient';

export const metadata: Metadata = {
  title: 'Notícias Financeiras e Criptomoedas | Busca Central',
  description: 'Acompanhe as últimas notícias e atualizações do mercado financeiro, blockchain e criptomoedas em tempo real.',
};

export default function NoticiasFinanceirasPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Notícias do Mercado e Cripto</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Fique por dentro de tudo que acontece no mundo dos investimentos, blockchain e economia digital.
          </p>
        </div>
        
        <NoticiasClient />
      </div>
    </main>
  );
}
