import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import SimuladorInvestimentosClient from './SimuladorInvestimentosClient';

export const metadata: Metadata = generateToolMetadata(
  'Simulador de Investimentos',
  'Compare investimentos: CDB, Tesouro Direto, poupança e mais. Simule rendimentos com impostos.',
  '/financeiro/simulador-investimentos'
);

export default function SimuladorInvestimentos() {
  return (
    <ToolPageLayout
      title="Simulador de Investimentos"
      description="Compare o rendimento do CDB, Tesouro Selic e Poupança de forma simples. Informe o valor, prazo e taxa para ver quanto seu dinheiro rende líquido após o Imposto de Renda."
      ariaLabel="Simulador de investimentos interativo"
    >
      <SimuladorInvestimentosClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>CDB vs Tesouro Selic vs Poupança</h2>
        <p>
          O <strong>CDB</strong> (Certificado de Depósito Bancário) é um título de renda fixa emitido por
          bancos. O <strong>Tesouro Selic</strong> é um título público federal. A <strong>Poupança</strong> é
          a aplicação mais tradicional do Brasil, isenta de IR mas com rendimento inferior.
        </p>
        <h2>Como funciona o IR?</h2>
        <p>
          O Imposto de Renda sobre investimentos de renda fixa segue a tabela regressiva: 22,5% até 180 dias,
          20% até 360 dias, 17,5% até 720 dias e 15% acima de 720 dias. A Poupança é isenta de IR.
        </p>
      </article>
    </ToolPageLayout>
  );
}
