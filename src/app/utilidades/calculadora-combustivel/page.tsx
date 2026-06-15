import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import CalculadoraCombustivelClient from './CalculadoraCombustivelClient';

export const metadata: Metadata = {
  title: 'Calculadora de Consumo de Combustível | BuscaCentral',
  description: 'Descubra quanto você vai gastar de gasolina, etanol ou diesel em uma viagem. Calcule os litros necessários e o custo exato por quilômetro.',
  keywords: ['calculadora de combustível', 'consumo de gasolina', 'gasto viagem', 'km por litro', 'custo de viagem'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/calculadora-combustivel' },
};

const faqItems = [
  { question: "Como descubro o consumo do meu carro (km/L)?", answer: "A maneira mais fácil é olhar o painel do seu carro, que geralmente indica o consumo médio (km/L). Caso o seu carro não possua computador de bordo, você pode encher o tanque, anotar a quilometragem, rodar até precisar abastecer novamente e dividir os quilômetros rodados pelos litros abastecidos." },
  { question: "O cálculo serve para qualquer combustível?", answer: "Sim. A fórmula é a mesma seja para Gasolina, Etanol, Diesel ou GNV. Basta inserir o preço correto do combustível que você irá utilizar na bomba e o consumo específico do seu carro com ele (já que o consumo com etanol é diferente da gasolina)." },
];

const relatedTools = [
  { title: "Calculadora de Desconto", url: "/utilidades/calculadora-desconto", description: "Calcule porcentagens de descontos em compras." },
  { title: "Conversor de Unidades", url: "/utilidades/conversor-unidades", description: "Converta distâncias, velocidade, volume e muito mais." },
  { title: "Calculadora de Porcentagem", url: "/utilidades/calculadora-porcentagem", description: "Realize cálculos percentuais rapidamente." },
];

export default function CalculadoraCombustivelPage() {
  return (
    <ToolPageLayout
      title="Calculadora de Combustível"
      description="Saiba exatamente quantos litros você vai gastar e o custo total da viagem."
      ariaLabel="Calculadora de Consumo de Combustível interativa"
      path="/utilidades/calculadora-combustivel"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <CalculadoraCombustivelClient />
    </ToolPageLayout>
  );
}
