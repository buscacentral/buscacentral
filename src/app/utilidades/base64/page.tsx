import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import Base64Client from './Base64Client';

export const metadata: Metadata = generateToolMetadata(
  'Codificador Base64',
  'Codifique ou decodifique textos em Base64. Conversão rápida e gratuita para URLs, emails e APIs.',
  '/utilidades/base64'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>O que é o Base64?</h2>
    <p>O <strong>Base64</strong> é um método de codificação que transforma dados binários em texto ASCII. É amplamente utilizado na web para transmitir dados em formatos que só aceitam texto, como e-mails, URLs e APIs.</p>

    <h3>Quando usar Base64?</h3>
    <ul>
      <li><strong>APIs REST:</strong> Autenticação Basic Auth usa Base64 para codificar usuário:senha.</li>
      <li><strong>Imagens em CSS/HTML:</strong> Data URIs usam Base64 para embutir imagens diretamente no código.</li>
      <li><strong>JSON Web Tokens (JWT):</strong> Os três blocos de um JWT são codificados em Base64.</li>
      <li><strong>E-mails:</strong> O padrão MIME usa Base64 para anexar arquivos em e-mails.</li>
    </ul>

    <h3>Como usar</h3>
    <ol>
      <li><strong>Cole o texto:</strong> Digite ou cole o texto que deseja codificar.</li>
      <li><strong>Codifique:</strong> Clique em &quot;Codificar&quot; para obter a versão em Base64.</li>
      <li><strong>Decodifique:</strong> Para reverter, cole o Base64 e clique em &quot;Decodificar&quot;.</li>
    </ol>
  </article>
);

const faqItems = [
  {
    question: "Base64 é uma criptografia?",
    answer: "Não. Base64 é uma codificação, não criptografia. Qualquer pessoa pode decodificar um texto Base64 facilmente. Nunca use Base64 para proteger dados sensíveis."
  },
  {
    question: "O texto codificado fica maior?",
    answer: "Sim. A codificação Base64 aumenta o tamanho dos dados em aproximadamente 33%, pois cada 3 bytes originais são representados por 4 caracteres Base64."
  },
  {
    question: "Funciona com imagens e arquivos?",
    answer: "Sim. O Base64 pode codificar qualquer dado binário, incluindo imagens, PDFs e áudios. Ferramentas como esta trabalham com texto, mas o mesmo princípio se aplica a arquivos."
  }
];

const relatedTools = [
  {
    title: "Formatador JSON/XML",
    url: "/utilidades/formatador-codigo",
    description: "Formate código JSON ou XML antes de codificar em Base64."
  },
  {
    title: "Gerador de UUID",
    url: "/utilidades/gerador-uuid",
    description: "Gere identificadores únicos para uso em APIs e bancos de dados."
  },
  {
    title: "Conversor de Timestamp",
    url: "/utilidades/timestamp",
    description: "Converta timestamps para datas legíveis."
  }
];

export default function Base64() {
  return (
    <ToolPageLayout
      title="Codificador Base64"
      description="Codifique ou decodifique textos em Base64. Conversão rápida e gratuita para URLs, emails e APIs."
      ariaLabel="Codificador Base64 interativo"
      path="/utilidades/base64"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <Base64Client />
    </ToolPageLayout>
  );
}
