import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import RescisaoTrabalhistaClient from './RescisaoTrabalhistaClient';

export const metadata: Metadata = generateToolMetadata(
  'Calculadora de Rescisão Trabalhista',
  'Calcule sua rescisão trabalhista: verbas rescisórias, 13º proporcional, férias, FGTS e multa.',
  '/financeiro/rescisao-trabalhista'
);

export default function RescisaoTrabalhista() {
  return (
    <ToolPageLayout
      title="Calculadora de Rescisão Trabalhista"
      description="Calcule os valores da sua rescisão trabalhista de forma rápida e gratuita. Nossa calculadora considera saldo de salário, aviso prévio, 13º salário proporcional, férias e multa do FGTS para todos os tipos de demissão."
      ariaLabel="Calculadora de rescisão trabalhista interativa"
    >
      <RescisaoTrabalhistaClient />

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Tipos de Rescisão</h2>
        <p>
          <strong>Sem justa causa:</strong> o empregador demite sem motivo. O trabalhador recebe todas as verbas,
          aviso prévio, multa de 40% do FGTS e tem direito ao seguro-desemprego.
        </p>
        <p>
          <strong>Pedido de demissão:</strong> o trabalhador pede para sair. Perde a multa do FGTS e o
          seguro-desemprego, e pode ter desconto do aviso prévio não cumprido.
        </p>
        <p>
          <strong>Justa causa:</strong> o empregador demite por falta grave. O trabalhador recebe apenas
          saldo de salário e férias vencidas.
        </p>
        <p>
          <strong>Acordo mútuo (art. 484-A):</strong> ambas as partes concordam. Multa FGTS de 20%,
          saque de 80% do FGTS, sem seguro-desemprego.
        </p>

        <h2>Como é feito o cálculo exato da nossa calculadora?</h2>
        <p>
          Diferente de outros simuladores da internet que calculam o FGTS e o 13º sobre bases erradas
          ou parciais, o BuscaCentral utiliza o histórico de meses trabalhados para projetar o saldo
          real acumulado do FGTS, aplicando a multa rescisória de 40% estritamente sobre o montante
          depositado e calculando as alíquotas de INSS e IRRF apenas sobre a base tributável permitida por lei.
        </p>
        <h3>13º Salário Proporcional</h3>
        <p>
          O 13º proporcional é calculado com base nos meses trabalhados <strong>no ano da demissão</strong>,
          e não no total de meses do contrato. Se o funcionário foi demitido em junho, recebe 6/12 avos
          do salário bruto, independentemente de ter trabalhado 2 ou 10 anos na empresa.
        </p>
        <h3>Férias Proporcionais</h3>
        <p>
          As férias proporcionais são calculadas sobre o período aquisitivo incompleto. Se o funcionário
          completou 3 anos e 7 meses, recebe férias por 7 meses (o restante do ciclo de 12 meses).
          A fórmula é: <code>(salário ÷ 12) × meses do período incompleto</code>, acrescida do terço constitucional.
        </p>
        <h3>FGTS e Multa Rescisória</h3>
        <p>
          O FGTS é calculado como <code>salário × meses trabalhados × 8%</code>. A multa de 40%
          (ou 20% no acordo mútuo) é aplicada <strong>exclusivamente sobre o FGTS acumulado</strong>,
          e não sobre o saldo de salário ou outras verbas. Isso garante que o valor da multa reflita
          o real patrimônio do trabalhador na conta do FGTS.
        </p>
        <h3>INSS e IRRF</h3>
        <p>
          Os descontos de INSS e IRRF incidem apenas sobre a <strong>base tributável</strong>: saldo de
          salário + aviso prévio indenizado. Férias, 13º proporcional e multa do FGTS <strong>não sofrem
          esses descontos</strong> na rescisão. Nossa calculadora respeita essa regra para não inflar
          artificialmente os descontos.
        </p>
      </article>
    </ToolPageLayout>
  );
}
