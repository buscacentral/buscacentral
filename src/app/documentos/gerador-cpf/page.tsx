import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorCPFClient from './GeradorCPFClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de CPF',
  'Gere CPFs válidos e formatados para testes e desenvolvimento. CPFs fictícios com algoritmo real de dígito verificador.',
  '/documentos/gerador-cpf'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona o Gerador de CPF?</h2>
    <p>O <strong>Gerador de CPF da BuscaCentral</strong> utiliza o algoritmo oficial de geração de números de Cadastro de Pessoa Física (CPF) determinado pela Receita Federal. Cada CPF gerado possui os 11 dígitos com os dois últimos sendo dígitos verificadores calculados matematicamente, garantindo que o número gerado seja válido segundo as regras oficiais.</p>

    <h3>Para que serve gerar CPFs?</h3>
    <ul>
      <li><strong>Desenvolvimento de Software:</strong> Desenvolvedores precisam de CPFs válidos para testar formulários, validações e integrações com sistemas que exigem esse dado.</li>
      <li><strong>Testes de Sistemas:</strong> Bancos de dados, APIs e aplicações que recebem CPF precisam ser testados com números que passem na validação matemática.</li>
      <li><strong>Formulários de Teste:</strong> Ao desenvolver sites com cadastro, é necessário testar se as máscaras de input e validações funcionam corretamente.</li>
    </ul>

    <h3>Como o algoritmo funciona?</h3>
    <p>O CPF é composto por 11 dígitos. Os 9 primeiros são a raiz do número, e os 2 últimos são calculados a partir deles usando um algoritmo de multiplicação com pesos. O gerador da BuscaCentral aplica essa mesma fórmula para criar números que passam em qualquer validação matemática de CPF.</p>

    <h3>Formato de saída</h3>
    <p>O gerador oferece o CPF em dois formatos: <strong>com pontuação</strong> (000.000.000-00) e <strong>sem pontuação</strong> (00000000000). Você pode copiar o resultado com um clique para usar no seu projeto.</p>
  </article>
);

const faqItems = [
  {
    question: "Os CPFs gerados são reais?",
    answer: "Não. Os CPFs são gerados aleatoriamente e podem coincidir com números reais emitidos pela Receita Federal, mas também podem não existir. A ferramenta apenas garante que a matemática dos dígitos verificadores está correta."
  },
  {
    question: "Posso usar os CPFs gerados para cadastros reais?",
    answer: "Não. Dados gerados por esta ferramenta são fictícios e destinados exclusivamente a testes e desenvolvimento. É proibido utilizá-los para fins ilegais."
  },
  {
    question: "O que são os dois últimos dígitos do CPF?",
    answer: "São os dígitos verificadores, calculados a partir dos 9 primeiros dígitos usando um algoritmo oficial da Receita Federal. Eles servem para validar se o número foi digitado corretamente."
  }
];

const relatedTools = [
  {
    title: "Validador de CPF",
    url: "/documentos/validador-cpf",
    description: "Confirme se um CPF possui a matemática correta dos dígitos verificadores."
  },
  {
    title: "Gerador de CNPJ",
    url: "/documentos/gerador-cnpj",
    description: "Gere CNPJs válidos para testes de sistemas empresariais."
  },
  {
    title: "Consulta CNPJ",
    url: "/documentos/consulta-cnpj",
    description: "Consulte dados reais de empresas pela Receita Federal."
  }
];

export default function GeradorCPF() {
  return (
    <ToolPageLayout
      title="Gerador de CPF"
      description="Gere CPFs válidos e formatados para uso em testes e desenvolvimento de software."
      ariaLabel="Gerador de CPF interativo"
      path="/documentos/gerador-cpf"
      lastUpdated="2026-06-16"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <GeradorCPFClient />
    </ToolPageLayout>
  );
}
