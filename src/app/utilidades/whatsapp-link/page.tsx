import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import WhatsAppLinkClient from './WhatsAppLinkClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de Link WhatsApp',
  'Gere links diretos para WhatsApp com mensagem pré-definida. Crie QR Codes para seu número.',
  '/utilidades/whatsapp-link'
);

export default function WhatsAppLink() {
  return (
    <ToolPageLayout
      title="Gerador de Link WhatsApp"
      description="Gere links diretos para WhatsApp com mensagem pré-definida. Crie QR Codes para seu número."
      ariaLabel="Gerador de link WhatsApp interativo"
    >
      <WhatsAppLinkClient />
    </ToolPageLayout>
  );
}
