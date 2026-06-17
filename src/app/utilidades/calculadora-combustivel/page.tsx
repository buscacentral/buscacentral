import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPageLayout from '@/components/ToolPageLayout';
import CalculadoraCombustivelClient from './CalculadoraCombustivelClient';

export const metadata: Metadata = {
  title: 'Calculadora de Combustível: gasolina, etanol e diesel | BuscaCentral',
  description: 'Calcule o gasto de combustível na viagem e descubra quantos litros R$ 100 compram. Funciona para gasolina, etanol e diesel. Grátis e sem cadastro.',
  keywords: [
    'calculadora de combustível',
    'calculadora de diesel',
    'consumo de gasolina',
    'quantos litros',
    '100 reais de gasolina da quantos litros',
    'gasto viagem',
    'km por litro',
    'custo de viagem',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/calculadora-combustivel' },
};

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como calcular o gasto de combustível da viagem</h2>
    <p>Para saber quanto vai gastar em uma viagem, a calculadora usa três informações: a <strong>distância</strong> (km), o <strong>consumo do veículo</strong> (km/litro) e o <strong>preço do combustível</strong> (R$/litro). A conta é:</p>
    <ul>
      <li><strong>Litros necessários</strong> = distância ÷ consumo</li>
      <li><strong>Custo total</strong> = litros × preço do litro</li>
    </ul>
    <p>Exemplo: numa viagem de 300 km, com um carro que faz 12 km/l, abastecendo a R$ 6,00 o litro, são 25 litros — cerca de R$ 150 só de ida.</p>

    <h2>Quantos litros R$ 100 de combustível compram?</h2>
    <p>Essa é uma das dúvidas mais comuns na bomba, e a conta é simples: <strong>litros = valor ÷ preço do litro</strong>. Veja exemplos com R$ 100:</p>
    <ul>
      <li>Gasolina a R$ 6,00/L → <strong>≈ 16,7 litros</strong></li>
      <li>Etanol a R$ 4,00/L → <strong>25 litros</strong></li>
      <li>Diesel a R$ 6,20/L → <strong>≈ 16,1 litros</strong></li>
    </ul>
    <p>Ou seja, basta dividir o valor que você quer abastecer pelo preço do litro no posto. Para saber quanto isso te leva de distância, multiplique os litros pelo consumo (km/l) do seu veículo.</p>

    <h2>Calculadora de diesel, gasolina, etanol ou GNV</h2>
    <p>A mesma ferramenta funciona como <strong>calculadora de diesel</strong>, gasolina, etanol ou GNV — a fórmula não muda. Basta informar o <strong>preço do combustível que você usa</strong> e o <strong>consumo específico do seu carro</strong> com ele. Atenção: o consumo costuma ser diferente para cada combustível (com etanol, por exemplo, o carro normalmente faz menos km/l do que com gasolina).</p>

    <h3>Gasolina ou etanol: qual compensa?</h3>
    <p>Na dúvida entre os dois, vale a clássica <strong>regra dos 70%</strong>: se o preço do etanol for até 70% do preço da gasolina, o etanol tende a compensar. Explicamos isso em detalhe no artigo{' '}
      <Link href="/artigos/etanol-ou-gasolina-regra-dos-70" className="text-blue-600 hover:underline">Etanol ou gasolina: a regra dos 70%</Link>.</p>
  </article>
);

const faqItems = [
  { question: "Quantos litros R$ 100 de gasolina compram?", answer: "Depende do preço na bomba. A conta é: litros = valor ÷ preço do litro. Com a gasolina a R$ 6,00, R$ 100 compram cerca de 16,7 litros; a R$ 5,50, cerca de 18,2 litros. Basta dividir o valor que deseja abastecer pelo preço do litro do posto." },
  { question: "Esta calculadora serve para diesel?", answer: "Sim. A fórmula é a mesma para diesel, gasolina, etanol ou GNV. Basta inserir o preço do diesel na bomba e o consumo do seu veículo (km/l) com diesel para descobrir os litros e o custo da viagem." },
  { question: "Como descubro o consumo do meu carro (km/L)?", answer: "A maneira mais fácil é olhar o painel do seu carro, que geralmente indica o consumo médio (km/L). Caso o seu carro não possua computador de bordo, você pode encher o tanque, anotar a quilometragem, rodar até precisar abastecer novamente e dividir os quilômetros rodados pelos litros abastecidos." },
  { question: "O cálculo serve para qualquer combustível?", answer: "Sim. A fórmula é a mesma seja para Gasolina, Etanol, Diesel ou GNV. Basta inserir o preço correto do combustível que você irá utilizar na bomba e o consumo específico do seu carro com ele (já que o consumo com etanol é diferente da gasolina)." },
];

const relatedTools = [
  { title: "Distância entre Cidades", url: "/localizacao/distancia-cidades", description: "Descubra a distância da viagem para estimar o combustível necessário." },
  { title: "Conversor de Unidades", url: "/utilidades/conversor-unidades", description: "Converta distâncias, velocidade, volume e muito mais." },
  { title: "Calculadora de Desconto", url: "/utilidades/calculadora-desconto", description: "Calcule porcentagens de descontos em compras." },
];

export default function CalculadoraCombustivelPage() {
  return (
    <ToolPageLayout
      title="Calculadora de Combustível"
      description="Saiba quantos litros você vai gastar, o custo total da viagem e quantos litros R$ 100 compram — para gasolina, etanol ou diesel."
      ariaLabel="Calculadora de Consumo de Combustível interativa"
      path="/utilidades/calculadora-combustivel"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <CalculadoraCombustivelClient />
    </ToolPageLayout>
  );
}
