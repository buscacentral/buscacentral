import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import FinanciamentoCarroClient from './FinanciamentoCarroClient';
import LinksRelacionados from '@/components/LinksRelacionados';

export const metadata: Metadata = generateToolMetadata(
  'Calculadora de Financiamento de Carro',
  'Simule o financiamento do seu carro. Calcule parcelas, juros totais e preço final pelo sistema Price ou SAC.',
  '/financeiro/financiamento-carro'
);

export default function FinanciamentoCarro() {
  return (
    <ToolPageLayout
      title="Simulador de Financiamento de Carro"
      description="Simule o financiamento do seu veículo e descubra o valor das parcelas, total de juros e custo efetivo. Compare os sistemas Price e SAC para escolher a melhor opção antes de fechar negócio."
      ariaLabel="Simulador de financiamento de carro interativo"
    >
      <FinanciamentoCarroClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Price vs SAC: qual a diferença?</h2>
        <p>
          No sistema <strong>Price</strong>, as parcelas são iguais do início ao fim. No <strong>SAC</strong>
          (Sistema de Amortização Constante), as parcelas começam mais altas e vão diminuindo, pois a
          amortização é fixa e os juros diminuem com o saldo.
        </p>
        <h2>Qual é mais vantajoso?</h2>
        <p>
          O SAC costuma ter um custo total menor em juros, mas as primeiras parcelas são mais altas.
          O Price oferece previsibilidade com parcelas fixas. A escolha depende do seu fluxo de caixa.
        </p>
      </article>

      <LinksRelacionados categoria="financeiro" paginaAtual="/financeiro/financiamento-carro" />
    </ToolPageLayout>
  );
}
