import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import PlanejadorViagemClient from './PlanejadorViagemClient';
import LinksRelacionados from '@/components/LinksRelacionados';

export const metadata: Metadata = {
  title: 'Planejador de Férias e Orçamento de Viagem | BuscaCentral',
  description: 'Planeje suas férias com calculadora de orçamento completa: passagem, hospedagem, alimentação, transporte e atividades. Calcule custo total e por pessoa.',
  keywords: ['planejador viagem', 'orçamento férias', 'custo viagem', 'calculadora viagem', 'planejamento férias'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/planejador-viagem' },
  openGraph: {
    title: 'Planejador de Férias e Orçamento de Viagem | BuscaCentral',
    description: 'Planeje suas férias com calculadora de orçamento completa. Custo total, por pessoa e por dia.',
    url: 'https://buscacentral.com.br/utilidades/planejador-viagem',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function PlanejadorViagemPage() {
  return (
    <ToolPageLayout
      title="Planejador de Férias"
      description="Planeje sua viagem com orçamento completo: passagem, hospedagem, alimentação, transporte e atividades."
      ariaLabel="Planejador de férias interativo"
    >
      <PlanejadorViagemClient />

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como planejar suas férias?</h2>
        <p>
          O planejamento antecipado de viagem ajuda a evitar gastos inesperados e permite
          aproveitar melhor o destino. Defina as datas, pesquise preços de passagens e hospedagem,
          e use esta calculadora para estimar o custo total antes de reservar.
        </p>
        <h2>Dicas para economizar</h2>
        <p>
          Viaje fora de alta temporada, pesquise passagens com antecedência, considere hospedagens
          alternativas (hostels, Airbnb) e estabeleça um orçamento diário para alimentação e
          transporte local.
        </p>
      </section>

      <LinksRelacionados categoria="utilidades" paginaAtual="/utilidades/planejador-viagem" />
    </ToolPageLayout>
  );
}
