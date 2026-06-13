import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import FormatadorCodigoClient from './FormatadorCodigoClient';

export const metadata: Metadata = generateToolMetadata(
  'Formatador JSON e XML',
  'Formate, minifique e valide código JSON e XML. Indentação automática e detecção de erros.',
  '/utilidades/formatador-codigo'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Por que formatar código?</h2>
    <p>O <strong>Formatador JSON e XML da BuscaCentral</strong> permite organizar código desformatado, corrigir erros de sintaxe e minificar arquivos para produção. É essencial para desenvolvedores que trabalham com APIs, configurações e arquivos de dados.</p>

    <h3>Funcionalidades</h3>
    <ul>
      <li><strong>Indentação automática:</strong> Transforma JSON/XML compacto em código legível com espaçamento correto.</li>
      <li><strong>Minificação:</strong> Remove espaços e quebras de linha para reduzir o tamanho do arquivo.</li>
      <li><strong>Validação:</strong> Detecta erros de sintaxe e mostra a linha exata do problema.</li>
      <li><strong>Syntax highlighting:</strong> Cores diferenciadas para chaves, valores e tags.</li>
    </ul>

    <h3>Como usar</h3>
    <ol>
      <li>Cole seu código JSON ou XML no campo de entrada.</li>
      <li>Clique em &quot;Formatar&quot; para indentar ou &quot;Minificar&quot; para compactar.</li>
      <li>Se houver erro de sintaxe, a ferramenta indica a linha e o tipo do erro.</li>
    </ol>
  </article>
);

const faqItems = [
  {
    question: "A ferramenta funciona com JSON e XML ao mesmo tempo?",
    answer: "Sim. A ferramenta detecta automaticamente o formato (JSON ou XML) e aplica a formatação correta para cada um."
  },
  {
    question: "Posso colar código muito grande?",
    answer: "Sim. A ferramenta é otimizada para lidar com arquivos grandes, processando milhares de linhas de código sem travar o navegador."
  },
  {
    question: "A formatação altera o sentido do código?",
    answer: "Não. A indentação apenas adiciona espaços e quebras de linha para tornar o código mais legível. O resultado é semanticamente idêntico ao original."
  }
];

const relatedTools = [
  {
    title: "Base64",
    url: "/utilidades/base64",
    description: "Codifique o código formatado em Base64 para transporte."
  },
  {
    title: "Comparador de Textos",
    url: "/utilidades/comparador-textos",
    description: "Compare duas versões do código formatado lado a lado."
  },
  {
    title: "Contador de Caracteres",
    url: "/utilidades/contador-caracteres",
    description: "Verifique o tamanho do código formatado ou minificado."
  }
];

export default function FormatadorCodigo() {
  return (
    <ToolPageLayout
      title="Formatador JSON e XML"
      description="Formate, minifique e valide código JSON e XML. Indentação automática e detecção de erros."
      ariaLabel="Formatador de código interativo"
      path="/utilidades/formatador-codigo"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <FormatadorCodigoClient />
    </ToolPageLayout>
  );
}
