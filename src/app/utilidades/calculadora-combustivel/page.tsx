import type { Metadata } from 'next';
import Link from 'next/link';
import ToolPageLayout from '@/components/ToolPageLayout';
import CalculadoraCombustivelClient from './CalculadoraCombustivelClient';

export const metadata: Metadata = {
  title: 'Cálculo de Combustível — Quanto Vou Gastar? | BuscaCentral',
  description: 'Descubra quanto vai gastar de gasolina, etanol ou diesel na viagem. Insira distância e consumo e tenha o resultado na hora. 100% grátis, sem cadastro e sem anúncios intrusivos.',
  keywords: [
    'calculadora de combustível',
    'calculo de gasolina',
    'consumo de combustivel',
    'calculadora de diesel',
    'consumo de gasolina',
    'quantos litros',
    '100 reais de gasolina da quantos litros',
    'gasto viagem',
    'km por litro',
    'custo de viagem',
    'gasolina ou etanol',
    'calcular combustível viagem',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/calculadora-combustivel' },
  openGraph: {
    title: 'Cálculo de Combustível — Quanto Vou Gastar? | BuscaCentral',
    description: 'Calcule o gasto de gasolina, etanol ou diesel da sua viagem em segundos. Ferramenta gratuita, sem cadastro e sem anúncios intrusivos.',
    url: 'https://buscacentral.com.br/utilidades/calculadora-combustivel',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cálculo de Combustível — Quanto Vou Gastar?',
    description: 'Calcule o gasto de gasolina, etanol ou diesel da sua viagem em segundos. Ferramenta gratuita e sem cadastro.',
  },
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

    <h2>Tabela de Consumo Médio por Tipo de Veículo e Combustível</h2>
    <p>Se você não sabe o consumo do seu carro, use a tabela abaixo como referência. Os valores são médias para condução em <strong>estrada</strong> (rodovia). Na cidade, considere 20-30% a mais de consumo. <strong>Importante:</strong> o rendimento varia conforme o combustível — com etanol, o carro rende em média 25-30% menos km/l do que com gasolina.</p>
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse border border-slate-300">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-4 py-2 text-left font-semibold">Tipo de Veículo</th>
            <th className="border border-slate-300 px-4 py-2 text-center font-semibold">Gasolina (estrada)</th>
            <th className="border border-slate-300 px-4 py-2 text-center font-semibold">Etanol (estrada)</th>
            <th className="border border-slate-300 px-4 py-2 text-center font-semibold">Diesel (estrada)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-300 px-4 py-2">Carro popular (1.0)</td>
            <td className="border border-slate-300 px-4 py-2 text-center">12–14 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">8–10 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">—</td>
          </tr>
          <tr className="bg-slate-50">
            <td className="border border-slate-300 px-4 py-2">Carro médio (1.4–1.6)</td>
            <td className="border border-slate-300 px-4 py-2 text-center">10–12 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">7–9 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">—</td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-4 py-2">Sedan / Hatch médio (1.8–2.0)</td>
            <td className="border border-slate-300 px-4 py-2 text-center">8–10 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">6–7 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">—</td>
          </tr>
          <tr className="bg-slate-50">
            <td className="border border-slate-300 px-4 py-2">SUV / Picape</td>
            <td className="border border-slate-300 px-4 py-2 text-center">7–9 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">5–7 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">9–12 km/l</td>
          </tr>
          <tr>
            <td className="border border-slate-300 px-4 py-2">Moto (125–300cc)</td>
            <td className="border border-slate-300 px-4 py-2 text-center">25–40 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">18–28 km/l</td>
            <td className="border border-slate-300 px-4 py-2 text-center">—</td>
          </tr>
          <tr className="bg-slate-50">
            <td className="border border-slate-300 px-4 py-2">Caminhão</td>
            <td className="border border-slate-300 px-4 py-2 text-center">—</td>
            <td className="border border-slate-300 px-4 py-2 text-center">—</td>
            <td className="border border-slate-300 px-4 py-2 text-center">3–5 km/l</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="text-sm text-slate-500">* Valores aproximados baseados em médias de mercado. O consumo real varia conforme modelo, ano, manutenção, estilo de condução e tipo de combustível utilizado. Com etanol, espere ~25-30% menos autonomia em relação à gasolina.</p>

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

    <h2>Dicas para economizar combustível</h2>
    <ul>
      <li><strong>Calibre os pneus</strong> semanalmente — pneus murchos aumentam o consumo em até 3%.</li>
      <li><strong>Evite acelerações bruscas</strong> — dirigir de forma suave pode reduzir o consumo em 15-20%.</li>
      <li><strong>Use o ar condicionado com moderação</strong> — na cidade ele pode aumentar o consumo em 10-20%.</li>
      <li><strong>Mantenha a manutenção em dia</strong> — filtros sujos e velas desgastadas prejudicam a eficiência.</li>
      <li><strong>Reduza peso desnecessário</strong> — cada 50 kg extras no porta-malas aumentam o consumo em ~2%.</li>
    </ul>
  </article>
);

const faqItems = [
  { question: "Como fazer o cálculo de gasolina para uma viagem?", answer: "Divida a distância total (km) pelo consumo do veículo (km/l) para descobrir quantos litros vai precisar. Depois, multiplique os litros pelo preço do litro na bomba. Exemplo: 400 km ÷ 12 km/l = 33,3 litros × R$ 6,00 = R$ 200,00. Use nossa calculadora acima para obter o resultado instantaneamente." },
  { question: "Quantos litros R$ 100 de gasolina compram?", answer: "Depende do preço na bomba. A conta é: litros = valor ÷ preço do litro. Com a gasolina a R$ 6,00, R$ 100 compram cerca de 16,7 litros; a R$ 5,50, cerca de 18,2 litros. Basta dividir o valor que deseja abastecer pelo preço do litro do posto." },
  { question: "Qual é o consumo médio de combustível por tipo de veículo?", answer: "O consumo varia conforme o veículo E o combustível utilizado. Com gasolina: carros populares (1.0) fazem 12-14 km/l, médios (1.4-1.6) fazem 10-12 km/l, SUVs ficam em 7-9 km/l e motos rendem 25-40 km/l. Com etanol, espere cerca de 25-30% menos autonomia (ex.: um 1.0 faz 8-10 km/l). Caminhões a diesel ficam entre 3-5 km/l. Valores de estrada — na cidade o consumo é 20-30% maior." },
  { question: "Gasolina ou etanol: qual compensa mais?", answer: "Use a regra dos 70%: se o preço do etanol for até 70% do preço da gasolina, o etanol compensa. Exemplo: gasolina a R$ 6,00 — o etanol compensa se estiver abaixo de R$ 4,20. Isso porque o etanol rende menos km/l que a gasolina (cerca de 70% do rendimento)." },
  { question: "Esta calculadora serve para diesel?", answer: "Sim. A fórmula é a mesma para diesel, gasolina, etanol ou GNV. Basta inserir o preço do diesel na bomba e o consumo do seu veículo (km/l) com diesel para descobrir os litros e o custo da viagem." },
  { question: "Como descubro o consumo do meu carro (km/L)?", answer: "A maneira mais fácil é olhar o computador de bordo do seu carro, que geralmente indica o consumo médio. Caso não possua, encha o tanque completamente, zere o hodômetro parcial, rode normalmente e, ao abastecer novamente, divida os km rodados pelos litros abastecidos. Repita 2-3 vezes para ter uma média confiável." },
  { question: "O consumo na cidade é diferente do consumo na estrada?", answer: "Sim. Na cidade, o consumo costuma ser 20-30% maior do que na estrada devido às paradas frequentes, trânsito e uso do ar condicionado. Para viagens, use o consumo rodoviário. Para deslocamentos urbanos, use o consumo da cidade. Muitos carros modernos mostram ambos os valores no painel." },
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
