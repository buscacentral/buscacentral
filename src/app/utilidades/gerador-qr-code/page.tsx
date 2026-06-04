import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorQRCodeClient from './GeradorQRCodeClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de QR Code',
  'Gere QR Codes a partir de textos ou URLs e baixe em PNG. Ferramenta gratuita e sem cadastro.',
  '/utilidades/gerador-qr-code'
);

export default function GeradorQRCode() {
  return (
    <ToolPageLayout
      title="Gerador de QR Code"
      description="Gere QR Codes a partir de textos ou URLs e baixe em PNG. Ferramenta gratuita e sem cadastro."
      ariaLabel="Gerador de QR Code interativo"
    >
      <GeradorQRCodeClient />
    </ToolPageLayout>
  );
}
