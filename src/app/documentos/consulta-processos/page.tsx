import type { Metadata } from 'next';
import ConsultaProcessosClient from './ConsultaProcessosClient';

export const metadata: Metadata = {
  title: 'Consulta de Processos pelo Nome | BuscaCentral',
  description: 'Descubra se você está sendo processado gerando links de busca em bancos de dados públicos como Jusbrasil e Escavador.',
  keywords: ['processo', 'nome', 'jusbrasil', 'escavador', 'tribunal', 'como saber se estou sendo processado'],
};

export default function ConsultaProcessosPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Consulta de Processos
          </h1>
          <p className="text-xl text-slate-600">
            Descubra se você tem processos públicos no seu nome. Gerador inteligente de links de busca do Jusbrasil e Escavador.
          </p>
        </div>

        <ConsultaProcessosClient />
      </div>
    </div>
  );
}
