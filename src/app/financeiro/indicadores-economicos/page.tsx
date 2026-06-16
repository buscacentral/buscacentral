import { Metadata } from 'next';
import IndicadoresClient from './IndicadoresClient';

export const metadata: Metadata = {
  title: 'Indicadores Econômicos (Selic, IPCA, CDI) | Busca Central',
  description: 'Consulte os principais indicadores econômicos brasileiros atualizados, como Taxa Selic, IPCA (Inflação) e CDI.',
};

export default function IndicadoresPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Indicadores Econômicos do Brasil</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Acompanhe as taxas oficiais atualizadas diretamente pelo Banco Central do Brasil.
            Esses indicadores afetam diretamente seus investimentos e financiamentos.
          </p>
        </div>
        
        <IndicadoresClient />
      </div>
    </main>
  );
}
