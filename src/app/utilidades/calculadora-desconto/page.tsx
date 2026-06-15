import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import CalculadoraDescontoClient from './CalculadoraDescontoClient';

export const metadata: Metadata = {
  title: 'Calculadora de Desconto Online Grátis | BuscaCentral',
  description: 'Calcule descontos de forma rápida. Informe o preço e a porcentagem para descobrir o valor final e quanto você economiza.',
  keywords: ['calculadora desconto', 'calcular desconto', 'desconto porcentagem', 'preço com desconto', 'quanto economizo'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/calculadora-desconto' },
  openGraph: {
    title: 'Calculadora de Desconto Online Grátis | BuscaCentral',
    description: 'Calcule descontos de forma rápida. Veja o preço final e a economia.',
    url: 'https://buscacentral.com.br/utilidades/calculadora-desconto',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

const faqItems = [
  { question: "Como calcular desconto de 20%?", answer: "Multiplique o valor por 20 e divida por 100. Exemplo: R$ 150 × 20 ÷ 100 = R$ 30 de desconto. Preço final: R$ 120." },
  { question: "Como saber quanto economizei?", answer: "A economia é a diferença entre o preço original e o preço com desconto. Nossa calculadora mostra esse valor automaticamente." },
  { question: "Posso calcular descontos acumulados?", answer: "Sim! Basta usar o resultado de um cálculo como preço original no próximo. Exemplo: 10% + 5% sobre R$ 100 = R$ 85,50 (não R$ 85)." },
];

const relatedTools = [
  { title: "Calculadora de Porcentagem", url: "/utilidades/calculadora-porcentagem", description: "Cálculos percentuais completos para qualquer situação." },
  { title: "Juros Compostos", url: "/financeiro/juros-compostos", description: "Simule juros compostos e veja seu dinheiro crescer." },
  { title: "Cotação de Moedas", url: "/financeiro/cotacao", description: "Acompanhe cotações do dólar, euro e outras moedas em tempo real." },
];

export default function CalculadoraDesconto() {
  return (
    <ToolPageLayout
      title="Calculadora de Desconto"
      description="Calcule descontos de forma rápida e veja quanto você economiza. Informe o preço e a porcentagem."
      ariaLabel="Calculadora de desconto interativa"
      path="/utilidades/calculadora-desconto"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <CalculadoraDescontoClient />
    </ToolPageLayout>
  );
}
