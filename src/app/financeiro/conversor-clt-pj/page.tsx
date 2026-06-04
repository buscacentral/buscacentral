import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ConversorCLTPJClient from './ConversorCLTPJClient';

export const metadata: Metadata = generateToolMetadata(
  'Conversor CLT para PJ',
  'Descubra quanto faturar como PJ para manter seu salário CLT. Calcule INSS, IRRF, FGTS e benefícios.',
  '/financeiro/conversor-clt-pj'
);

export default function ConversorCLTPJ() {
  return (
    <ToolPageLayout
      title="Calculadora CLT para PJ"
      description="Converta seu salário CLT para PJ com precisão. Nossa calculadora considera INSS, IRRF, FGTS, 13º, férias, PLR e todos os benefícios para mostrar o faturamento real necessário."
      ariaLabel="Conversor CLT para PJ interativo"
    >
      <ConversorCLTPJClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Calculadora CLT para PJ: como converter seu salário com precisão</h2>
        <p>
          Nossa <strong>calculadora CLT para PJ</strong> foi desenvolvida para mostrar o faturamento real necessário ao migrar do regime celetista para Pessoa Jurídica. Diferente de simuladores comuns que apenas aplicam uma margem fixa, esta ferramenta calcula a <strong>base tributável</strong> corretamente — considerando que INSS e IRRF incidem apenas sobre o salário bruto, enquanto verbas indenizatórias como vale-refeição e plano de saúde são isentas.
        </p>

        <h3>Como o FGTS é projetado neste cálculo</h3>
        <p>
          O FGTS (Fundo de Garantia do Tempo de Serviço) representa 8% do salário bruto depositado mensalmente pela empresa. Ao converter para PJ, você perde esse depósito acumulado. Nossa calculadora projeta o saldo acumulado com base nos meses trabalhados e inclui a multa rescisória de 40% sobre o total — um valor que muitos simuladores ignoram, mas que faz diferença significativa no cálculo.
        </p>

        <h3>Por que considerar PLR e benefícios na conversão</h3>
        <p>
          A diluição de benefícios como PLR, Gympass e plano de saúde é essencial para um cálculo realista. Ao informar sua PLR anual, a calculadora divide por 12 e soma ao ganho mensal, mostrando o verdadeiro custo que a empresa tem com você como CLT. Assim, o faturamento PJ calculado reflete exatamente o que você precisa cobrar para manter o mesmo padrão de vida.
        </p>

        <h3>Entendendo a base tributável CLT</h3>
        <p>
          A base tributável é o valor sobre o qual incidem INSS e IRRF. No CLT, ela inclui salário bruto e aviso prévio, mas exclui benefícios como vale-transporte, vale-refeição e plano de saúde (quando não há opção em dinheiro). Esta distinção é crucial para calcular corretamente os descontos e comparar com o regime PJ.
        </p>
      </article>
    </ToolPageLayout>
  );
}
