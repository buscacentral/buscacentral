import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorSenhaClient from './GeradorSenhaClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de Senha',
  'Gere senhas seguras e aleatórias com letras, números e caracteres especiais. Senhas fortes para sua segurança.',
  '/utilidades/gerador-senha'
);

export default function GeradorSenha() {
  return (
    <ToolPageLayout
      title="Gerador de Senha"
      description="Gere senhas seguras e aleatórias com letras, números e caracteres especiais. Senhas fortes para sua segurança."
      ariaLabel="Gerador de senha interativo"
    >
      <GeradorSenhaClient />
    </ToolPageLayout>
  );
}
