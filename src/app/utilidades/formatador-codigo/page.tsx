import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import FormatadorCodigoClient from './FormatadorCodigoClient';

export const metadata: Metadata = generateToolMetadata(
  'Formatador JSON e XML',
  'Formate, minifique e valide código JSON e XML. Indentação automática e detecção de erros.',
  '/utilidades/formatador-codigo'
);

export default function FormatadorCodigo() {
  return (
    <ToolPageLayout
      title="Formatador JSON e XML"
      description="Formate, minifique e valide código JSON e XML. Indentação automática e detecção de erros."
      ariaLabel="Formatador de código interativo"
    >
      <FormatadorCodigoClient />
    </ToolPageLayout>
  );
}
