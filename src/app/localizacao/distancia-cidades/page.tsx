import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import DistanciaCidadesClient from './DistanciaCidadesClient';

export const metadata: Metadata = generateToolMetadata(
  'Distância entre Cidades',
  'Calcule a distância entre cidades brasileiras, tempo de viagem e custo de combustível. Coordenadas do IBGE.',
  '/localizacao/distancia-cidades'
);

export default function DistanciaCidades() {
  return (
    <ToolPageLayout
      title="Distância entre Cidades"
      description="Calcule a distância em linha reta e a estimativa rodoviária entre cidades brasileiras."
      ariaLabel="Calculadora de distância entre cidades"
    >
      <DistanciaCidadesClient />
    </ToolPageLayout>
  );
}
