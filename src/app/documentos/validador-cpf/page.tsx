import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ValidadorCPFClient from './ValidadorCPFClient';

export const metadata: Metadata = generateToolMetadata(
  'Validador de CPF',
  'Verifique se um CPF é válido usando o algoritmo oficial de dígito verificador da Receita Federal.',
  '/documentos/validador-cpf'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona o Validador de CPF?</h2>
    <p>O <strong>Validador de CPF da BuscaCentral</strong> é uma ferramenta matemática simples e rápida para desenvolvedores, profissionais de RH ou qualquer pessoa que precise conferir se uma sequência de 11 números forma um CPF válido segundo as regras da Receita Federal.</p>

    <h3>O que essa ferramenta faz na prática?</h3>
    <p>Nossa ferramenta realiza a conferência dos dois últimos números do CPF (chamados de Dígitos Verificadores). O algoritmo funciona da seguinte maneira:</p>
    <ul>
      <li>Pega os 9 primeiros dígitos digitados e realiza um cálculo matemático padronizado.</li>
      <li>Se o resultado desse cálculo bater exatamente com o 10º dígito, a primeira etapa está correta.</li>
      <li>Em seguida, faz um novo cálculo usando os 10 primeiros dígitos para conferir o 11º dígito.</li>
    </ul>
    <p>Se as duas contas baterem, o CPF é considerado válido. Caso o usuário digite "111.111.111-11", a ferramenta automaticamente identifica como falso, pois essa é uma regra de bloqueio do algoritmo oficial.</p>

    <h3>Para que serve validar o CPF?</h3>
    <ul>
      <li><strong>Prevenção de Erros de Digitação:</strong> Ideal para quem está preenchendo formulários importantes (como cadastros, e-commerce ou emissão de notas fiscais) e quer evitar erros antes do envio.</li>
      <li><strong>Testes de Sistemas (Desenvolvedores):</strong> Quem desenvolve sites ou aplicativos frequentemente precisa testar máscaras de formulários para garantir que o sistema rejeite CPFs com a matemática incorreta.</li>
      <li><strong>Filtragem de Leads Falsos:</strong> Profissionais de marketing e vendas podem validar listas de cadastros para remover pessoas que preencheram dados fictícios.</li>
    </ul>

    <h3>Privacidade e Segurança</h3>
    <p>Fique tranquilo: <strong>nós não temos acesso à base de dados da Receita Federal</strong>. Isso significa que a ferramenta confirma apenas se a <em>matemática</em> do CPF está correta (se ele pode existir). Ela não informa a quem o CPF pertence, nem verifica se o nome da pessoa está sujo ou se ela está viva ou morta. Tudo é processado localmente no seu computador e nenhum dado é salvo em nossos servidores.</p>
  </article>
);

const faqItems = [
  {
    question: "O validador informa o nome do titular do CPF?",
    answer: "Não. Por questões rígidas de privacidade (LGPD) e segurança, apenas a Receita Federal e instituições autorizadas podem associar um número de CPF ao nome de uma pessoa. Nossa ferramenta valida apenas o algoritmo matemático dos dígitos verificadores."
  },
  {
    question: "Um CPF válido nesta ferramenta significa que ele existe?",
    answer: "Nem sempre. Nossa ferramenta verifica se o CPF é matematicamente possível. Você pode gerar um CPF aleatório (usando um Gerador de CPF) que passará como válido aqui, mesmo que a Receita Federal nunca o tenha emitido para um cidadão."
  },
  {
    question: "Posso usar essa ferramenta para testar meus softwares?",
    answer: "Sim, desenvolvedores costumam usar validadores para conferir se os formulários que criaram estão aceitando corretamente as máscaras de pontuação (123.456.789-00) e rejeitando dígitos matematicamente inválidos."
  }
];

const relatedTools = [
  {
    title: "Validador de CNPJ",
    url: "/documentos/validador-cnpj",
    description: "Confira a validade matemática de Cadastros Nacionais de Pessoa Jurídica (CNPJ)."
  },
  {
    title: "Dias Úteis",
    url: "/utilidades/dias-uteis",
    description: "Se o seu cadastro exige prazos contratuais, calcule quantos dias úteis existem em um período."
  },
  {
    title: "Contador de Caracteres",
    url: "/utilidades/contador-caracteres",
    description: "Confira rapidamente se as strings de banco de dados ou formulários estão no tamanho correto."
  }
];

export default function ValidadorCPF() {
  return (
    <ToolPageLayout
      title="Validador de CPF"
      description="Verifique instantaneamente se um CPF é válido segundo o algoritmo oficial da Receita Federal. Ferramenta gratuita para testes de formulários e cadastros."
      ariaLabel="Validador de CPF interativo"
      path="/documentos/validador-cpf"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ValidadorCPFClient />
    </ToolPageLayout>
  );
}
