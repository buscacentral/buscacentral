import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorCNPJClient from './GeradorCNPJClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de CNPJ',
  'Gere CNPJs válidos e formatados para testes de sistemas e desenvolvimento. CNPJ com dígito verificador correto.',
  '/documentos/gerador-cnpj'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona o Gerador de CNPJ?</h2>
    <p>O <strong>Gerador de CNPJ da BuscaCentral</strong> utiliza o algoritmo oficial de geração de Cadastro Nacional de Pessoa Jurídica determinado pela Receita Federal. Cada CNPJ gerado possui os 14 dígitos com os dois últimos sendo dígitos verificadores calculados matematicamente.</p>

    <h3>Para que serve gerar CNPJs?</h3>
    <ul>
      <li><strong>Desenvolvimento de Software:</strong> Desenvolvedores precisam de CNPJs válidos para testar sistemas de emissão de notas fiscais, cadastros empresariais e integrações com APIs.</li>
      <li><strong>Testes de Formulários:</strong> Sites com cadastro PJ precisam validar se as máscaras de input funcionam corretamente.</li>
      <li><strong>Bancos de Dados:</strong> Sistemas que armazenam CNPJ precisam de dados de teste que passem na validação.</li>
    </ul>

    <h3>Estrutura do CNPJ</h3>
    <p>O CNPJ é composto por 14 dígitos no formato 00.000.000/0001-00. Os 8 primeiros são a raiz, os 4 seguintes indicam a filial (0001 = matriz), e os 2 últimos são dígitos verificadores calculados por algoritmo oficial.</p>
  </article>
);

const faqItems = [
  {
    question: "Os CNPJs gerados são reais?",
    answer: "Não. Os CNPJs são gerados aleatoriamente com dígitos verificadores válidos. Podem coincidir com CNPJs reais, mas também podem não existir."
  },
  {
    question: "Posso usar os CNPJs gerados para emissão de notas?",
    answer: "Não. Dados gerados por esta ferramenta são fictícios e destinados exclusivamente a testes e desenvolvimento."
  },
  {
    question: "O que é a matriz e filial no CNPJ?",
    answer: "A matriz é a sede principal da empresa (/0001). Filiais são unidades secundárias (/0002, /0003, etc.). O gerador cria CNPJs com indicação de matriz."
  }
];

const relatedTools = [
  {
    title: "Validador de CNPJ",
    url: "/documentos/validador-cnpj",
    description: "Confirme se um CNPJ possui a matemática correta dos dígitos verificadores."
  },
  {
    title: "Consulta CNPJ",
    url: "/documentos/consulta-cnpj",
    description: "Consulte dados reais de empresas pela Receita Federal."
  },
  {
    title: "Gerador de CPF",
    url: "/documentos/gerador-cpf",
    description: "Gere CPFs válidos para testes de sistemas."
  }
];

export default function GeradorCNPJ() {
  return (
    <ToolPageLayout
      title="Gerador de CNPJ"
      description="Gere CNPJs válidos e formatados para uso em testes e desenvolvimento de sistemas."
      ariaLabel="Gerador de CNPJ interativo"
      path="/documentos/gerador-cnpj"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <GeradorCNPJClient />
    </ToolPageLayout>
  );
}
