import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import CalculadoraIMCClient from './CalculadoraIMCClient';

export const metadata: Metadata = generateToolMetadata(
  'Calculadora de IMC',
  'Calcule seu IMC, veja classificação OMS, faixa de peso saudável e taxa metabólica basal (TMB).',
  '/utilidades/calculadora-imc'
);

export default function CalculadoraIMC() {
  return (
    <ToolPageLayout
      title="Calculadora de IMC"
      description="Calcule seu IMC, veja classificação OMS, faixa de peso saudável e taxa metabólica basal (TMB)."
      ariaLabel="Calculadora de IMC interativa"
    >
      <CalculadoraIMCClient />
    </ToolPageLayout>
  );
}
