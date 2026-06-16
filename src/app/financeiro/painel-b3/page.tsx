import { Metadata } from 'next';
import PainelB3Client from './PainelB3Client';

export const metadata: Metadata = {
  title: 'Painel B3 (Ações e FIIs) | Busca Central',
  description: 'Consulte a cotação em tempo real de ações e fundos imobiliários da bolsa de valores brasileira (B3).',
};

export default function PainelB3Page() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Painel B3 (Ações e FIIs)</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Acompanhe a cotação em tempo real dos principais ativos da bolsa brasileira. 
            Digite o código do ticker (ex: PETR4, MXRF11, ITUB4) para ver os detalhes.
          </p>
        </div>
        
        <PainelB3Client />
      </div>
    </main>
  );
}
