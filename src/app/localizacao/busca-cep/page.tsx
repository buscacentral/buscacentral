import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import BuscaCEPClient from './BuscaCEPClient';

export const metadata: Metadata = generateToolMetadata(
  'Busca de CEP',
  'Consulte endereços completos por CEP ou busque CEPs por nome de rua. Dados do ViaCEP em tempo real.',
  '/localizacao/busca-cep'
);

export default function BuscaCEP() {
  return (
    <ToolPageLayout
      title="Busca de CEP"
      description="Consulte endereços por CEP ou busque CEPs por endereço usando a API ViaCEP."
      ariaLabel="Busca de CEP interativa"
    >
      <BuscaCEPClient />
    </ToolPageLayout>
  );
}
