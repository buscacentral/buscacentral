import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import DiasUteisClient from './DiasUteisClient';

export const metadata: Metadata = generateToolMetadata(
  'Calculadora de Dias Úteis',
  'Calcule dias úteis entre duas datas considerando feriados nacionais. Ideal para prazos e entregas.',
  '/utilidades/dias-uteis'
);

export default function DiasUteis() {
  return (
    <ToolPageLayout
      title="Calculadora de Dias Úteis"
      description="Calcule dias úteis entre duas datas considerando feriados nacionais. Ideal para prazos e entregas."
      ariaLabel="Calculadora de dias úteis interativa"
    >
      <DiasUteisClient />
    </ToolPageLayout>
  );
}
