import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ExtratorEmailsClient from './ExtratorEmailsClient';

export const metadata: Metadata = generateToolMetadata(
  'Extrator de Emails',
  'Extraia endereços de email de qualquer texto ou documento. Liste todos os emails encontrados.',
  '/utilidades/extrator-emails'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona o Extrator de Emails?</h2>
    <p>O <strong>Extrator de Emails da BuscaCentral</strong> analisa qualquer texto e identifica automaticamente todos os endereços de e-mail presentes. Ideal para profissionais de marketing, vendas e qualquer pessoa que precise extrair contatos de documentos ou páginas web.</p>

    <h3>Como usar</h3>
    <ol>
      <li><strong>Cole o texto:</strong> Insira o texto que contém os endereços de e-mail.</li>
      <li><strong>Clique em extrair:</strong> A ferramenta identifica todos os e-mails automaticamente.</li>
      <li><strong>Copie a lista:</strong> Copie todos os e-mails encontrados de uma vez.</li>
    </ol>

    <h3>Casos de uso</h3>
    <ul>
      <li><strong>Marketing:</strong> Extraia e-mails de listas públicas para campanhas.</li>
      <li><strong>Vendas:</strong> Colete contatos de sites de empresas.</li>
      <li><strong>Pesquisa:</strong> Extraia e-mails de artigos e documentos acadêmicos.</li>
      <li><strong>Limpeza de dados:</strong> Extraia e-mails de planilhas ou textos desorganizados.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "A ferramenta valida se os e-mails existem?",
    answer: "Não. A ferramenta apenas identifica padrões de e-mail no texto. Para verificar se um e-mail é válido, você precisaria de uma ferramenta de validação específica."
  },
  {
    question: "Funciona com e-mails de qualquer domínio?",
    answer: "Sim. A ferramenta identifica qualquer string que corresponda ao padrão de e-mail, incluindo domínios como @gmail.com, @empresa.com.br, etc."
  },
  {
    question: "Posso extrair e-mails de uma página web?",
    answer: "Sim. Copie o conteúdo da página web (Ctrl+A, Ctrl+C) e cole na ferramenta. Todos os e-mails presentes no texto serão extraídos."
  }
];

const relatedTools = [
  {
    title: "Removedor de Duplicatas",
    url: "/utilidades/removedor-duplicatas",
    description: "Remova e-mails duplicados da lista extraída."
  },
  {
    title: "Contador de Caracteres",
    url: "/utilidades/contador-caracteres",
    description: "Verifique o tamanho do texto antes de extrair os e-mails."
  },
  {
    title: "Link WhatsApp",
    url: "/utilidades/whatsapp-link",
    description: "Gere links de WhatsApp para os contatos extraídos."
  }
];

export default function ExtratorEmails() {
  return (
    <ToolPageLayout
      title="Extrator de Emails"
      description="Extraia endereços de email de qualquer texto ou documento. Liste todos os emails encontrados."
      ariaLabel="Extrator de emails interativo"
      path="/utilidades/extrator-emails"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ExtratorEmailsClient />
    </ToolPageLayout>
  );
}
