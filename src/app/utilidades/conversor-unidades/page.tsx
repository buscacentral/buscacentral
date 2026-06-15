import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import ConversorUnidadesClient from './ConversorUnidadesClient';

export const metadata: Metadata = {
  title: 'Conversor de Unidades Online Grátis | BuscaCentral',
  description: 'Converta unidades de comprimento, peso, temperatura, área, volume, velocidade e dados digitais de forma rápida e gratuita.',
  keywords: ['conversor unidades', 'converter metros', 'converter kg', 'celsius fahrenheit', 'conversor online'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/conversor-unidades' },
  openGraph: {
    title: 'Conversor de Unidades Online Grátis | BuscaCentral',
    description: 'Converta unidades de 7 categorias diferentes de forma rápida e gratuita.',
    url: 'https://buscacentral.com.br/utilidades/conversor-unidades',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

const faqItems = [
  { question: "Como converter Celsius para Fahrenheit?", answer: "Multiplique a temperatura em Celsius por 9/5 e some 32. Exemplo: 25°C = (25 × 9/5) + 32 = 77°F." },
  { question: "Quantos metros tem uma milha?", answer: "Uma milha equivale a 1.609,344 metros ou aproximadamente 1,6 quilômetros." },
  { question: "Quantas libras tem um quilograma?", answer: "Um quilograma equivale a aproximadamente 2,205 libras (lbs)." },
];

const relatedTools = [
  { title: "Calculadora de Porcentagem", url: "/utilidades/calculadora-porcentagem", description: "Cálculos percentuais para qualquer situação." },
  { title: "Calculadora de IMC", url: "/utilidades/calculadora-imc", description: "Calcule seu IMC e veja sua classificação." },
  { title: "Distância entre Cidades", url: "/localizacao/distancia-cidades", description: "Calcule a distância entre duas cidades brasileiras." },
];

export default function ConversorUnidades() {
  return (
    <ToolPageLayout
      title="Conversor de Unidades"
      description="Converta unidades de comprimento, peso, temperatura, área, volume, velocidade e dados digitais de forma instantânea."
      ariaLabel="Conversor de unidades interativo"
      path="/utilidades/conversor-unidades"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ConversorUnidadesClient />
    </ToolPageLayout>
  );
}
