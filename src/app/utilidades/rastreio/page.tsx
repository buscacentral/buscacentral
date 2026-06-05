import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import RastreioClient from './RastreioClient';

export const metadata: Metadata = generateToolMetadata(
  'Rastreador de Encomendas',
  'Rastreie encomendas dos Correios em tempo real. Acompanhe a entrega dos seus pacotes com atualizações instantâneas via BrasilAPI.',
  '/utilidades/rastreio'
);

export default function RastreioPage() {
  return (
    <ToolPageLayout
      title="Rastreador de Encomendas"
      description="Acompanhe seus pacotes dos Correios em tempo real com atualizações instantâneas."
      ariaLabel="Rastreador de encomendas interativo"
    >
      <RastreioClient />

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona o rastreamento?</h2>
        <p>
          O rastreador do BuscaCentral utiliza a BrasilAPI, que consolida dados logísticos
          dos Correios e outras transportadoras. Basta digitar o código de rastreio (ex: BR123456789BR)
          para ver o histórico completo de movimentações do seu pacote.
        </p>
      </section>
    </ToolPageLayout>
  );
}
