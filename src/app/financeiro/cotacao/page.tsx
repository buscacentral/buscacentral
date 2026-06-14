import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import CotacaoClient from './CotacaoClient';

export const metadata: Metadata = {
  title: 'Cotação do Dólar, Euro e Libra Hoje em Tempo Real | BuscaCentral',
  description: 'Cotação do Dólar Comercial, Euro e Libra Esterlina hoje em tempo real em Reais (BRL). Conversor bidirecional gratuito, tabelas de conversão rápida e dados da AwesomeAPI atualizados a cada minuto.',
  keywords: [
    'cotação dólar hoje', 'cotação euro hoje', 'cotação libra hoje',
    'dólar comercial tempo real', 'euro real', 'libra esterlina real',
    'conversor moeda', 'cotação moedas hoje', 'AwesomeAPI',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/financeiro/cotacao' },
  openGraph: {
    title: 'Cotação do Dólar, Euro e Libra Hoje em Tempo Real | BuscaCentral',
    description: 'Cotação do Dólar Comercial, Euro e Libra Esterlina hoje em tempo real. Conversor bidirecional gratuito e dados atualizados a cada minuto.',
    url: 'https://buscacentral.com.br/financeiro/cotacao',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cotação do Dólar, Euro e Libra Hoje em Tempo Real | BuscaCentral',
    description: 'Cotação do Dólar, Euro e Libra hoje em tempo real. Conversor bidirecional gratuito.',
  },
};

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Sobre as cotações de moedas</h2>
    <p>
      As cotações são obtidas em tempo real através da AwesomeAPI, uma das principais APIs
      de economia do Brasil. Os valores representam a cotação de compra (bid) e venda (ask)
      das moedas em relação ao Real Brasileiro (BRL).
    </p>
    <h2>Por que as cotações mudam?</h2>
    <p>
      As cotações de moedas são influenciadas por diversos fatores econômicos, como inflação,
      taxa de juros, balança comercial e cenário político. A atualização automática a cada
      minuto garante que você sempre tenha os valores mais recentes.
    </p>
    <h3>Como usar o conversor</h3>
    <ol>
      <li><strong>Selecione a moeda:</strong> Escolha entre Dólar, Euro, Libra e outras moedas disponíveis.</li>
      <li><strong>Digite o valor:</strong> Informe o valor em Reais para ver a conversão, ou o valor na moeda estrangeira para ver o equivalente em BRL.</li>
      <li><strong>Resultado instantâneo:</strong> A conversão é calculada automaticamente com a cotação mais recente.</li>
    </ol>
    <h3>Diferença entre compra e venda</h3>
    <p>
      <strong>Cotação de compra (bid):</strong> Valor que o banco paga quando você vende a moeda estrangeira.
      <strong>Cotação de venda (ask):</strong> Valor que você paga quando compra a moeda estrangeira. A diferença
      entre as duas é a margem do banco (spread).
    </p>
  </article>
);

const faqItems = [
  {
    question: "Como é calculada a cotação do Dólar Comercial em tempo real?",
    answer: "A cotação do Dólar Comercial exibida no BuscaCentral é obtida em tempo real através da AwesomeAPI, que agrega dados dos principais mercados financeiros brasileiros. O valor representa a cotação de compra (bid) em Reais (BRL), atualizada a cada minuto para garantir precisão."
  },
  {
    question: "Qual a diferença entre o Dólar Turismo e o Dólar Comercial exibido no BuscaCentral?",
    answer: "O Dólar Comercial é a cotação usada em transações financeiras entre bancos e empresas, sem IOF ou spread de casas de câmbio. O Dólar Turismo inclui IOF (até 1,1%), spread da casa de câmbio e custos operacionais, sendo sempre mais caro. O BuscaCentral exibe o Dólar Comercial, que é a referência oficial do mercado."
  },
  {
    question: "Como converter Euro ou Libra para Real usando a calculadora?",
    answer: "Na página de Cotação do BuscaCentral, selecione a moeda desejada (Euro ou Libra Esterlina) clicando no cartão da moeda. Em seguida, use o conversor bidirecional: digite o valor na moeda estrangeira para ver o equivalente em Reais, ou digite em Reais para converter para Euro ou Libra. A tabela de conversões rápidas exibe valores pré-calculados para referências comuns como 1, 5, 10, 50, 100, 500 e 1000 unidades."
  },
  {
    question: "Com que frequência as cotações são atualizadas?",
    answer: "As cotações são atualizadas a cada minuto através da AwesomeAPI, garantindo dados sempre atualizados durante o horário comercial."
  },
  {
    question: "Qual a diferença entre cotação de compra e venda?",
    answer: "A cotação de compra (bid) é o valor que o banco paga quando você vende a moeda. A cotação de venda (ask) é o valor que você paga ao comprar. A diferença é a margem do banco."
  },
  {
    question: "As cotações são oficiais?",
    answer: "As cotações são obtidas da AwesomeAPI, que compila dados de múltiplas fontes do mercado financeiro brasileiro. São valores de referência, não necessariamente os de uma instituição específica."
  }
];

const relatedTools = [
  {
    title: "Criptomoedas",
    url: "/financeiro/criptomoedas",
    description: "Acompanhe as principais criptomoedas com cotação em tempo real."
  },
  {
    title: "Juros Compostos",
    url: "/financeiro/juros-compostos",
    description: "Simule investimentos e veja como seu dinheiro pode crescer."
  },
  {
    title: "Tabela FIPE",
    url: "/financeiro/tabela-fipe",
    description: "Consulte preços de veículos para planejar sua compra."
  }
];

export default function Cotacao() {
  return (
    <ToolPageLayout
      title="Cotação do Dólar, Euro e Libra em Tempo Real"
      description="Cotações em tempo real das principais moedas estrangeiras em relação ao Real Brasileiro."
      ariaLabel="Cotação de moedas interativa"
      path="/financeiro/cotacao"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <CotacaoClient faqItems={faqItems} />
    </ToolPageLayout>
  );
}
