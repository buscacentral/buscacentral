import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import CalculadoraPorcentagemClient from './CalculadoraPorcentagemClient';

export const metadata: Metadata = {
  title: 'Calculadora de Porcentagem Online Grátis | BuscaCentral',
  description: 'Calcule porcentagem de forma rápida e gratuita. Descubra quanto é X% de Y, variação percentual, acréscimo e desconto. Sem cadastro.',
  keywords: ['calculadora porcentagem', 'porcentagem online', 'calcular porcentagem', 'quanto é x por cento', 'variação percentual'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/calculadora-porcentagem' },
  openGraph: {
    title: 'Calculadora de Porcentagem Online Grátis | BuscaCentral',
    description: 'Calcule porcentagem de forma rápida e gratuita. 4 modos de cálculo.',
    url: 'https://buscacentral.com.br/utilidades/calculadora-porcentagem',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

const faqItems = [
  {
    question: "Como calcular porcentagem de um valor?",
    answer: "Para calcular X% de um valor Y, basta multiplicar Y por X e dividir por 100. Exemplo: 15% de 200 = 200 × 15 ÷ 100 = 30."
  },
  {
    question: "Como calcular variação percentual?",
    answer: "A variação percentual é calculada pela fórmula: ((Valor Final - Valor Inicial) ÷ Valor Inicial) × 100. Exemplo: de 80 para 100 = ((100-80) ÷ 80) × 100 = 25% de aumento."
  },
  {
    question: "Como calcular desconto em porcentagem?",
    answer: "Para aplicar um desconto de X% sobre um valor Y: Y - (Y × X ÷ 100). Exemplo: 20% de desconto em R$ 150 = 150 - (150 × 20 ÷ 100) = R$ 120."
  }
];

const relatedTools = [
  { title: "Calculadora de Desconto", url: "/utilidades/calculadora-desconto", description: "Calcule descontos de forma rápida e veja quanto você economiza." },
  { title: "Juros Compostos", url: "/financeiro/juros-compostos", description: "Simule juros compostos e veja seu dinheiro crescer." },
  { title: "Conversor CLT → PJ", url: "/financeiro/conversor-clt-pj", description: "Descubra quanto faturar como PJ para manter seu salário." },
];

export default function CalculadoraPorcentagem() {
  return (
    <ToolPageLayout
      title="Calculadora de Porcentagem"
      description="Calcule porcentagem online de forma rápida e gratuita. Quanto é X% de Y, variação percentual, acréscimo e desconto."
      ariaLabel="Calculadora de porcentagem interativa"
      path="/utilidades/calculadora-porcentagem"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <CalculadoraPorcentagemClient />
    </ToolPageLayout>
  );
}
