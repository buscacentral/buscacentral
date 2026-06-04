import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import JurosCompostosClient from './JurosCompostosClient';

export const metadata: Metadata = generateToolMetadata(
  'Calculadora de Juros Compostos',
  'Simule investimentos com juros compostos. Calcule o rendimento do seu dinheiro ao longo do tempo.',
  '/financeiro/juros-compostos'
);

export default function JurosCompostos() {
  return (
    <ToolPageLayout
      title="Simulador de Juros Compostos"
      description="Simule o crescimento dos seus investimentos com aportes mensais e juros compostos."
      ariaLabel="Calculadora de juros compostos interativa"
    >
      <JurosCompostosClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que são juros compostos?</h2>
        <p>
          Juros compostos são os juros calculados sobre o capital inicial mais os juros acumulados 
          dos períodos anteriores. É o famoso &quot;juros sobre juros&quot;, que faz o dinheiro crescer 
          exponencialmente ao longo do tempo.
        </p>
        <h2>Por que simular?</h2>
        <p>
          Simular investimentos ajuda a entender quanto você pode acumular ao longo do tempo, 
          considerando aportes regulares e a taxa de retorno. É essencial para planejar a 
          aposentadoria, compra de imóveis ou qualquer objetivo financeiro.
        </p>
      </article>
    </ToolPageLayout>
  );
}
