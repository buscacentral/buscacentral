import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import PlanejadorViagemClient from './PlanejadorViagemClient';

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

const seoContent = (
  <article className="prose prose-gray max-w-none">
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
    <h3>Como usar a calculadora</h3>
    <ol>
      <li><strong>Passagens:</strong> Informe o valor das passagens aéreas ou rodoviárias.</li>
      <li><strong>Hospedagem:</strong> Defina o custo por noite e a quantidade de noites.</li>
      <li><strong>Alimentação:</strong> Estime o gasto diário com refeições.</li>
      <li><strong>Transporte:</strong> Inclua aluguel de carro, táxi, Uber ou transporte público.</li>
      <li><strong>Atividades:</strong> Adicione ingressos, excursões e passeios.</li>
      <li><strong>Número de pessoas:</strong> A calculadora divide o custo total por pessoa automaticamente.</li>
    </ol>
  </article>
);

const faqItems = [
  {
    question: "A calculadora inclui a taxa de câmbio para viagens internacionais?",
    answer: "Sim. Para viagens internacionais, você pode informar o valor em moeda estrangeira e a calculadora converte automaticamente usando a cotação do dia."
  },
  {
    question: "Posso salvar o orçamento?",
    answer: "Sim. A ferramenta permite copiar o resumo do orçamento para usar em planilhas ou compartilhar com os companheiros de viagem."
  },
  {
    question: "A calculadora considera seguro viagem?",
    answer: "O seguro viagem não está incluído por padrão, mas você pode adicioná-lo como um item extra no orçamento."
  }
];

const relatedTools = [
  {
    title: "Clima",
    url: "/localizacao/clima",
    description: "Consulte o clima do destino antes de planejar a viagem."
  },
  {
    title: "Distância entre Cidades",
    url: "/localizacao/distancia-cidades",
    description: "Calcule a distância para planejar a rota da viagem."
  },
  {
    title: "Cotação de Moedas",
    url: "/financeiro/cotacao",
    description: "Acompanhe a cotação do dólar para viagens internacionais."
  }
];

export default function PlanejadorViagemPage() {
  return (
    <ToolPageLayout
      title="Planejador de Férias"
      description="Planeje sua viagem com orçamento completo: passagem, hospedagem, alimentação, transporte e atividades."
      ariaLabel="Planejador de férias interativo"
      path="/utilidades/planejador-viagem"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <PlanejadorViagemClient />
    </ToolPageLayout>
  );
}
