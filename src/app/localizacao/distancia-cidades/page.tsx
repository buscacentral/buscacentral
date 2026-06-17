import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import DistanciaCidadesClient from './DistanciaCidadesClient';
import { citySlug, pairUrl } from '@/lib/distancia-cidades';
import Link from 'next/link';

export const metadata: Metadata = generateToolMetadata(
  'Distância entre Cidades',
  'Calcule a distância entre cidades brasileiras, tempo de viagem e custo de combustível. Coordenadas do IBGE.',
  '/localizacao/distancia-cidades'
);

// Pares de capitais com maior volume de busca, para links internos rumo às
// páginas programáticas de distância (/localizacao/distancia/...).
const distanciasPopulares: [string, string, string, string][] = [
  ['São Paulo', 'SP', 'Rio de Janeiro', 'RJ'],
  ['São Paulo', 'SP', 'Belo Horizonte', 'MG'],
  ['São Paulo', 'SP', 'Curitiba', 'PR'],
  ['São Paulo', 'SP', 'Brasília', 'DF'],
  ['Rio de Janeiro', 'RJ', 'Belo Horizonte', 'MG'],
  ['São Paulo', 'SP', 'Salvador', 'BA'],
  ['São Paulo', 'SP', 'Porto Alegre', 'RS'],
  ['Rio de Janeiro', 'RJ', 'Salvador', 'BA'],
  ['Brasília', 'DF', 'Goiânia', 'GO'],
  ['São Paulo', 'SP', 'Fortaleza', 'CE'],
  ['Recife', 'PE', 'Salvador', 'BA'],
  ['Curitiba', 'PR', 'Florianópolis', 'SC'],
];

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona o Cálculo de Distância entre Cidades?</h2>
    <p>A ferramenta de <strong>Distância entre Cidades da BuscaCentral</strong> foi desenvolvida para ajudar motoristas, caminhoneiros, viajantes e empresas de logística a planejar rotas pelo Brasil. Utilizando a base de dados oficial do IBGE (Instituto Brasileiro de Geografia e Estatística), cruzamos as coordenadas exatas de todos os municípios brasileiros para fornecer resultados rápidos e precisos.</p>

    <h3>O que a calculadora mostra?</h3>
    <p>Ao selecionar a cidade de origem e a cidade de destino, o sistema realiza um cálculo matemático e exibe duas informações essenciais:</p>
    <ul>
      <li><strong>Distância em Linha Reta:</strong> Também conhecida como distância "voo de pássaro". É a distância exata de um ponto a outro no mapa, sem considerar ruas, estradas ou desvios geográficos.</li>
      <li><strong>Distância Rodoviária Estimada:</strong> Como as rodovias possuem curvas, montanhas e contornos, aplicamos um fator de correção padrão de logística (cerca de +30%) sobre a linha reta. Esse valor representa uma estimativa muito próxima da quilometragem que o seu carro ou caminhão vai rodar no asfalto.</li>
    </ul>

    <h3>Por que essa ferramenta é útil?</h3>
    <ul>
      <li><strong>Planejamento de Combustível:</strong> Sabendo a quilometragem estimada da viagem, você pode calcular quanto vai gastar de gasolina, etanol ou diesel antes de sair de casa.</li>
      <li><strong>Precificação de Fretes:</strong> Empresas de mudança e transportadoras autônomas utilizam a quilometragem para formar o preço do frete a ser cobrado do cliente.</li>
      <li><strong>Estudo e Geografia:</strong> Estudantes e pesquisadores podem descobrir rapidamente as distâncias geográficas entre as capitais e o interior do país.</li>
    </ul>

    <h3>Como usar a ferramenta passo a passo</h3>
    <ol>
      <li>Na primeira caixa, selecione o Estado (UF) e depois digite o nome da <strong>Cidade de Origem</strong>.</li>
      <li>Na segunda caixa, repita o processo selecionando o Estado (UF) e a <strong>Cidade de Destino</strong>.</li>
      <li>O cálculo é automático! O mapa abaixo das caixas mostrará visualmente os dois pontos no território nacional e exibirá a quilometragem.</li>
    </ol>

    <h3>Distâncias mais buscadas</h3>
    <p>Veja a distância, o tempo de viagem e o custo de combustível das rotas mais procuradas entre capitais:</p>
    <ul className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2">
      {distanciasPopulares.map(([nomeA, ufA, nomeB, ufB]) => (
        <li key={`${ufA}-${ufB}`}>
          <Link
            href={pairUrl(citySlug(nomeA, ufA), citySlug(nomeB, ufB))}
            className="text-blue-600 hover:underline"
          >
            Distância de {nomeA} a {nomeB}
          </Link>
        </li>
      ))}
    </ul>
  </article>
);

const faqItems = [
  {
    question: "A distância estimada é exatamente a rota do GPS?",
    answer: "Não exatamente. Ferramentas de GPS (como Google Maps ou Waze) calculam a rota rua por rua, em tempo real, considerando trânsito e pontes. Nossa ferramenta usa um cálculo geográfico sobre coordenadas e aplica uma correção para estimar estradas. O valor rodoviário será bem aproximado da realidade, mas pode variar dependendo do trajeto que você escolher dirigir."
  },
  {
    question: "A base de dados possui todas as cidades do Brasil?",
    answer: "Sim! Utilizamos a base atualizada de municípios do IBGE, o que abrange todas as mais de 5.500 cidades reconhecidas em todos os 26 estados mais o Distrito Federal."
  },
  {
    question: "Funciona para cidades de outros países?",
    answer: "No momento, o sistema está configurado exclusivamente para calcular distâncias entre os municípios localizados dentro do território nacional (Brasil)."
  }
];

const relatedTools = [
  {
    title: "Financiamento de Carro",
    url: "/financeiro/financiamento-carro",
    description: "Vai trocar de carro para viajar? Simule as parcelas de um financiamento e veja as taxas."
  },
  {
    title: "Tabela FIPE",
    url: "/financeiro/tabela-fipe",
    description: "Consulte o preço médio do seu veículo usado para negociar antes de uma longa viagem."
  },
  {
    title: "Dias Úteis",
    url: "/utilidades/dias-uteis",
    description: "Planejando prazos de frete? Calcule quantos dias úteis a mercadoria demorará para chegar."
  }
];

export default function DistanciaCidades() {
  return (
    <ToolPageLayout
      title="Distância entre Cidades"
      description="Calcule a quilometragem em linha reta e a estimativa rodoviária entre qualquer município do Brasil utilizando as coordenadas oficiais do IBGE."
      ariaLabel="Calculadora de distância entre cidades"
      path="/localizacao/distancia-cidades"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <DistanciaCidadesClient />
    </ToolPageLayout>
  );
}
