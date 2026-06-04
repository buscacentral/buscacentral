import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ExtratorEmailsClient from './ExtratorEmailsClient';

export const metadata: Metadata = generateToolMetadata(
  'Extrator de Emails',
  'Extraia endereços de email de qualquer texto ou documento. Liste todos os emails encontrados.',
  '/utilidades/extrator-emails'
);

export default function ExtratorEmails() {
  return (
    <ToolPageLayout
      title="Extrator de Emails"
      description="Extraia endereços de email de qualquer texto ou documento. Liste todos os emails encontrados."
      ariaLabel="Extrator de emails interativo"
    >
      <ExtratorEmailsClient />
    </ToolPageLayout>
  );
}
