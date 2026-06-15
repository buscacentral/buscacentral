import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import SalarioLiquidoClient from './SalarioLiquidoClient';

export const metadata: Metadata = {
  title: 'Calculadora de Salário Líquido 2024 | BuscaCentral',
  description: 'Calcule seu salário líquido mensal exato com base nas tabelas vigentes de 2024 do INSS e IRPF. Simule descontos de pensão, dependentes e mais.',
  keywords: ['salário líquido', 'calculadora salário', 'inss', 'irpf', 'descontos salário', 'cálculo trabalhista'],
  alternates: { canonical: 'https://buscacentral.com.br/financeiro/salario-liquido' },
};

const faqItems = [
  { question: "Como é calculado o Salário Líquido?", answer: "O salário líquido é o resultado do Salário Bruto menos os descontos oficiais, como o INSS (Previdência Social) e o IRPF (Imposto de Renda), além de descontos opcionais ou judiciais como pensão alimentícia e vale-transporte." },
  { question: "As tabelas de INSS e IRPF estão atualizadas?", answer: "Sim, a calculadora utiliza as tabelas e alíquotas progressivas oficiais de 2024 estabelecidas pelo governo federal." },
  { question: "O que são dependentes no IRPF?", answer: "São pessoas (como filhos ou cônjuge) que dependem financeiramente do trabalhador. Cada dependente gera uma dedução na base de cálculo do Imposto de Renda, reduzindo o imposto a pagar." },
];

const relatedTools = [
  { title: "Cálculo de Férias", url: "/financeiro/ferias", description: "Calcule quanto você receberá em suas férias, com o abono de 1/3." },
  { title: "Cálculo de 13º Salário", url: "/financeiro/decimo-terceiro", description: "Descubra o valor da primeira e segunda parcela do 13º." },
  { title: "Cálculo CLT x PJ", url: "/financeiro/clt-pj", description: "Compare propostas e descubra qual vale mais a pena." },
];

export default function SalarioLiquidoPage() {
  return (
    <ToolPageLayout
      title="Calculadora de Salário Líquido"
      description="Descubra exatamente quanto vai cair na sua conta. Simule os descontos de INSS, IRPF e dependentes."
      ariaLabel="Calculadora de Salário Líquido interativa"
      path="/financeiro/salario-liquido"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <SalarioLiquidoClient />
    </ToolPageLayout>
  );
}
