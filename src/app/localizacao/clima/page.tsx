import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import ClimaClient from './ClimaClient';

export const metadata: Metadata = {
  title: 'Previsão do Tempo de 5 Dias e Clima Atual | BuscaCentral',
  description: 'Consulte a previsão do tempo estendida de 5 dias, sensação térmica, probabilidade de chuva e clima atual de qualquer cidade gratuitamente.',
  keywords: [
    'previsão do tempo 5 dias', 'clima hoje', 'temperatura atual',
    'sensação térmica', 'probabilidade de chuva', 'condição climática', 'clima tempo'
  ],
  alternates: { canonical: 'https://buscacentral.com.br/localizacao/clima' },
  openGraph: {
    title: 'Previsão do Tempo de 5 Dias e Clima Atual | BuscaCentral',
    description: 'Consulte a previsão do tempo estendida de 5 dias, sensação térmica, probabilidade de chuva e clima atual de qualquer cidade gratuitamente.',
    url: 'https://buscacentral.com.br/localizacao/clima',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Previsão do Tempo de 5 Dias e Clima Atual | BuscaCentral',
    description: 'Consulte a previsão do tempo estendida de 5 dias, sensação térmica, probabilidade de chuva e clima atual de qualquer cidade gratuitamente.',
  },
};

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona a consulta de clima?</h2>
    <p>
      O BuscaCentral utiliza a API Open-Meteo, uma fonte gratuita e aberta de dados
      meteorológicos globais. Os dados incluem temperatura, umidade e velocidade do vento
      atualizados em tempo real.
    </p>
    <h3>Como usar</h3>
    <ol>
      <li><strong>Pesquise a cidade:</strong> Digite o nome da cidade brasileira no campo de busca.</li>
      <li><strong>Veja o clima atual:</strong> Temperatura, sensação térmica, umidade e vento.</li>
      <li><strong>Previsão estendida:</strong> Acompanhe a previsão para os próximos 5 dias.</li>
    </ol>
    <h3>Dados disponíveis</h3>
    <ul>
      <li><strong>Temperatura:</strong> Valor atual em graus Celsius.</li>
      <li><strong>Sensação térmica:</strong> Como o corpo humano percebe a temperatura (considerando vento e umidade).</li>
      <li><strong>Probabilidade de chuva:</strong> Percentual de chance de precipitação.</li>
      <li><strong>Condição climática:</strong> Ensolarado, nublado, chuvoso, etc.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "A previsão do tempo é precisa?",
    answer: "A previsão de curto prazo (1-3 dias) costuma ser bastante precisa. Previsões para 5 dias ou mais podem ter variações, mas a API Open-Meteo utiliza modelos meteorológicos reconhecidos internacionalmente."
  },
  {
    question: "A ferramenta funciona para cidades pequenas?",
    answer: "Sim. A API Open-Meteo cobre todas as cidades do Brasil, incluindo municípios pequenos, utilizando dados de estações meteorológicas e modelos computacionais."
  },
  {
    question: "Com que frequência os dados são atualizados?",
    answer: "Os dados meteorológicos são atualizados a cada hora, garantindo informações sempre atuais sobre as condições climáticas."
  }
];

const relatedTools = [
  {
    title: "Busca de CEP",
    url: "/localizacao/busca-cep",
    description: "Consulte o CEP da cidade que você quer visiting."
  },
  {
    title: "Distância entre Cidades",
    url: "/localizacao/distancia-cidades",
    description: "Calcule a distância até o destino da sua viagem."
  },
  {
    title: "Planejador de Férias",
    url: "/utilidades/planejador-viagem",
    description: "Planeje sua viagem considerando o clima do destino."
  }
];

export default function ClimaPage() {
  return (
    <ToolPageLayout
      title="Previsão do Tempo (5 Dias)"
      description="Consulte o clima atual, a sensação térmica e a previsão de 5 dias para qualquer região."
      ariaLabel="Consulta de clima interativa"
      path="/localizacao/clima"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ClimaClient />
    </ToolPageLayout>
  );
}
