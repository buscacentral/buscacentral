import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorUUIDClient from './GeradorUUIDClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de UUID',
  'Gere UUIDs v4 aleatórios para identificadores únicos em sistemas e bancos de dados.',
  '/utilidades/gerador-uuid'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>O que é um UUID?</h2>
    <p>O <strong>UUID (Universally Unique Identifier)</strong> é um identificador de 128 bits usado para diferenciar informações em sistemas de computação. O formato v4 gera valores completamente aleatórios, garantindo uma probabilidade estatisticamente insignificante de colisão.</p>

    <h3>Para que servem UUIDs?</h3>
    <ul>
      <li><strong>Bancos de dados:</strong> Identificadores únicos para registros (tabelas de pedidos, usuários, etc.).</li>
      <li><strong>APIs REST:</strong> URLs como <code>/api/users/550e8400-e29b-41d4-a716-446655440000</code>.</li>
      <li><strong>Sistemas distribuídos:</strong> Quando múltiplos servidores geram IDs sem coordenação central.</li>
      <li><strong>Testes de software:</strong> Gerar dados de teste únicos para populações de banco de dados.</li>
    </ul>

    <h3>Formato do UUID v4</h3>
    <p>Um UUID v4 tem o formato: <code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>, onde <code>4</code> indica a versão e <code>y</code> pode ser 8, 9, A ou B. Exemplo: <code>550e8400-e29b-41d4-a716-446655440000</code>.</p>
  </article>
);

const faqItems = [
  {
    question: "UUID v4 é realmente único?",
    answer: "A probabilidade de colisão (dois UUIDs iguais) é de aproximadamente 1 em 2^122, o que é estatisticamente impossível de ocorrer em sistemas reais."
  },
  {
    question: "Posso gerar múltiplos UUIDs de uma vez?",
    answer: "Sim. Nossa ferramenta permite gerar até 10 UUIDs simultaneamente para agilizar a criação de dados de teste."
  },
  {
    question: "UUIDs são seguros para uso em URLs?",
    answer: "Sim. UUIDs são strings seguras para URLs, pois contêm apenas caracteres hexadecimais e hífens."
  }
];

const relatedTools = [
  {
    title: "Gerador de Senha",
    url: "/utilidades/gerador-senha",
    description: "Gere senhas seguras e aleatórias com caracteres especiais."
  },
  {
    title: "Base64",
    url: "/utilidades/base64",
    description: "Codifique UUIDs ou outros dados em formato Base64."
  },
  {
    title: "Formatador JSON/XML",
    url: "/utilidades/formatador-codigo",
    description: "Formate JSON contendo UUIDs para exibição."
  }
];

export default function GeradorUUID() {
  return (
    <ToolPageLayout
      title="Gerador de UUID"
      description="Gere UUIDs v4 aleatórios para identificadores únicos em sistemas e bancos de dados."
      ariaLabel="Gerador de UUID interativo"
      path="/utilidades/gerador-uuid"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <GeradorUUIDClient />
    </ToolPageLayout>
  );
}
