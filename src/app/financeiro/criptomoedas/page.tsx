import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import CriptomoedasClient from './CriptomoedasClient';

export const metadata: Metadata = generateToolMetadata(
  'Criptomoedas',
  'Top 50 criptomoedas por valor de mercado com cotação em tempo real, gráficos 7 dias, calculadora de lucro e Fear & Greed Index.',
  '/financeiro/criptomoedas'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Guia Completo de Cotação de Criptomoedas</h2>
    <p>O <strong>Painel de Criptomoedas da BuscaCentral</strong> oferece a você uma visão completa e em tempo real do mercado de ativos digitais. Acompanhe as 50 maiores moedas por capitalização de mercado, analise o sentimento geral dos investidores e simule seus lucros e perdas com nossa calculadora integrada.</p>

    <h3>Como acompanhar a tabela de cotações</h3>
    <p>A tabela foi desenvolvida para oferecer dados acionáveis e rápidos:</p>
    <ul>
      <li><strong>Preço atual (BRL):</strong> O valor da moeda convertido para Reais, atualizado em tempo real utilizando a API oficial do CoinGecko.</li>
      <li><strong>Variação de 24h:</strong> Mostra o percentual de valorização (verde) ou desvalorização (vermelho) da moeda no último dia.</li>
      <li><strong>Valor de Mercado:</strong> Representa o tamanho total da moeda (preço atual multiplicado pelo número de moedas em circulação).</li>
      <li><strong>Volume em 24h:</strong> Indica a liquidez da moeda, ou seja, quanto dinheiro foi negociado em trocas nesse ativo nas últimas 24 horas.</li>
    </ul>

    <h3>O que é o Fear & Greed Index?</h3>
    <p>O <em>Fear & Greed Index</em> (Índice de Medo e Ganância) é um dos indicadores de sentimento mais respeitados no mercado financeiro e de criptomoedas, fornecido pela Alternative.me.</p>
    <p>Ele varia de 0 a 100 e é calculado analisando volatilidade, volume do mercado, interações nas redes sociais e tendências do Google. A interpretação padrão é:</p>
    <ul>
      <li><strong>0 a 24 (Medo Extremo):</strong> Os investidores estão muito preocupados e vendendo seus ativos. Historicamente, pode representar uma oportunidade de compra.</li>
      <li><strong>25 a 49 (Medo):</strong> O mercado está cauteloso, com tendência de baixa.</li>
      <li><strong>50 (Neutro):</strong> Sem tendência clara entre compradores e vendedores.</li>
      <li><strong>51 a 74 (Ganância):</strong> O mercado está confiante e comprando.</li>
      <li><strong>75 a 100 (Ganância Extrema):</strong> Os investidores estão extremamente eufóricos, comprando agressivamente. Frequentemente sinaliza que o mercado está "esticado" e uma correção pode estar próxima.</li>
    </ul>

    <h3>Benefícios de monitorar o mercado de perto</h3>
    <p>No universo das criptomoedas, a volatilidade é muito maior do que no mercado de ações tradicional. Usar um painel consolidado oferece:</p>
    <ul>
      <li><strong>Decisões baseadas em dados:</strong> Evita compras impulsivas guiadas por influenciadores.</li>
      <li><strong>Acompanhamento centralizado:</strong> Você não precisa de vários aplicativos para ver gráficos de 7 dias, preços em BRL e calculadoras de lucro.</li>
      <li><strong>Gestão de risco:</strong> Usar a calculadora de lucro e perda ajuda a estabelecer metas de saída antes de entrar em uma operação.</li>
    </ul>

    <h3>Dicas de Segurança para Investidores</h3>
    <p>O mercado cripto é revolucionário, mas exige cuidados redobrados:</p>
    <ol>
      <li>Nunca invista dinheiro que você precisará no curto prazo.</li>
      <li>Não confie cegamente em projetos com promessas de retornos garantidos (isso não existe em renda variável).</li>
      <li>Se você comprou criptomoedas, transfira-as para uma carteira pessoal (hardware wallet ou software wallet). Evite deixar ativos parados em corretoras (exchanges) por longos períodos.</li>
    </ol>
  </article>
);

const faqItems = [
  {
    question: "De onde vêm os preços exibidos na tabela de criptomoedas?",
    answer: "Todos os dados são extraídos em tempo real através da API pública do CoinGecko, uma das fontes mais precisas e respeitadas para cotação e dados de criptomoedas no mundo."
  },
  {
    question: "O que é a capitalização de mercado (Market Cap)?",
    answer: "A capitalização de mercado indica o valor total de uma criptomoeda. Ela é calculada multiplicando o preço atual da moeda pela quantidade total de moedas que estão circulando no momento."
  },
  {
    question: "Com que frequência o Fear & Greed Index é atualizado?",
    answer: "O índice de Medo e Ganância geralmente é atualizado uma vez por dia e reflete o sentimento acumulado das últimas 24 horas."
  }
];

const relatedTools = [
  {
    title: "Cotação de Moedas Fiduciárias",
    url: "/financeiro/cotacao",
    description: "Acompanhe as taxas de câmbio do Dólar, Euro, Libra e outras moedas tradicionais em tempo real."
  },
  {
    title: "Simulador de Investimentos",
    url: "/financeiro/simulador-investimentos",
    description: "Simule os ganhos de longo prazo na renda fixa para balancear o risco do seu portfólio."
  },
  {
    title: "Juros Compostos",
    url: "/financeiro/juros-compostos",
    description: "Faça o cálculo de como aportes regulares podem multiplicar seu patrimônio ao longo do tempo."
  }
];

export default function Criptomoedas() {
  return (
    <ToolPageLayout
      title="Criptomoedas"
      description="Top 50 criptomoedas com cotação em tempo real, gráficos, calculadora de lucro e Fear & Greed Index."
      ariaLabel="Cotação de criptomoedas interativa"
      path="/financeiro/criptomoedas"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <CriptomoedasClient />
    </ToolPageLayout>
  );
}
