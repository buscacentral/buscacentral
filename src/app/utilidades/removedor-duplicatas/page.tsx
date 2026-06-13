import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import RemovedorDuplicatasClient from './RemovedorDuplicatasClient';

export const metadata: Metadata = generateToolMetadata(
  'Removedor de Duplicatas',
  'Remova linhas duplicadas de listas e ordene alfabeticamente. Limpe dados rapidamente.',
  '/utilidades/removedor-duplicatas'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Por que remover duplicatas?</h2>
    <p>O <strong>Removedor de Duplicatas da BuscaCentral</strong> limpa listas removendo itens repetidos e ordenando os resultados alfabeticamente. Essencial para profissionais de dados, marketing e qualquer pessoa que trabalhe com listas grandes.</p>

    <h3>Como usar</h3>
    <ol>
      <li><strong>Cole a lista:</strong> Insira os itens, um por linha.</li>
      <li><strong>Clique em remover duplicatas:</strong> A ferramenta identifica e remove itens repetidos.</li>
      <li><strong>Copie o resultado:</strong> A lista limpa e ordenada fica pronta para uso.</li>
    </ol>

    <h3>Casos de uso</h3>
    <ul>
      <li><strong>Marketing:</strong> Limpe listas de e-mails duplicados antes de campanhas.</li>
      <li><strong>Vendas:</strong> Remova leads repetidos de CRM.</li>
      <li><strong>Pesquisa:</strong> Limpe listas de palavras-chave ou termos duplicados.</li>
      <li><strong>Dados:</strong> Prepare listas para importação em bancos de dados.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "A ferramenta diferencia maiúsculas de minúsculas?",
    answer: "Não. A comparação é case-insensitive, ou seja, 'Email' e 'email' são considerados o mesmo item."
  },
  {
    question: "Posso remover espaços extras automaticamente?",
    answer: "Sim. A ferramenta remove espaços em branco no início e final de cada linha antes de comparar."
  },
  {
    question: "Qual o limite de itens na lista?",
    answer: "A ferramenta processa listas de qualquer tamanho diretamente no navegador, sem limites práticos."
  }
];

const relatedTools = [
  {
    title: "Extrator de Emails",
    url: "/utilidades/extrator-emails",
    description: "Extraia e-mails de textos e depois remova duplicatas desta lista."
  },
  {
    title: "Comparador de Textos",
    url: "/utilidades/comparador-textos",
    description: "Compare a lista original com a lista limpa para ver o que foi removido."
  },
  {
    title: "Contador de Caracteres",
    url: "/utilidades/contador-caracteres",
    description: "Verifique o tamanho da lista antes e depois da limpeza."
  }
];

export default function RemovedorDuplicatas() {
  return (
    <ToolPageLayout
      title="Removedor de Duplicatas"
      description="Remova linhas duplicadas de listas e ordene alfabeticamente. Limpe dados rapidamente."
      ariaLabel="Removedor de duplicatas interativo"
      path="/utilidades/removedor-duplicatas"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <RemovedorDuplicatasClient />
    </ToolPageLayout>
  );
}
