import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ValidadorCNPJClient from './ValidadorCNPJClient';

export const metadata: Metadata = generateToolMetadata(
  'Validador de CNPJ',
  'Valide CNPJs com verificação oficial de dígito verificador. Confira se o formato está correto.',
  '/documentos/validador-cnpj'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Entenda como funciona o Validador de CNPJ</h2>
    <p>O <strong>Validador de CNPJ da BuscaCentral</strong> é uma ferramenta desenhada para testar rapidamente se um Cadastro Nacional de Pessoa Jurídica (CNPJ) possui o formato e a lógica matemática exigidos pela Receita Federal do Brasil. Ideal para testes de software, cadastros de fornecedores e auditorias internas.</p>

    <h3>Como a validação matemática acontece?</h3>
    <p>Um CNPJ possui 14 dígitos (no formato 00.000.000/0001-00). A nossa ferramenta ignora pontos, barras e traços e foca nos números:</p>
    <ul>
      <li>Os primeiros 12 dígitos são a raiz do CNPJ (sendo que o &quot;/0001&quot; indica a matriz e &quot;/0002&quot; em diante indicam filiais).</li>
      <li>Os dois últimos números são os <strong>Dígitos Verificadores (DV)</strong>.</li>
    </ul>
    <p>O validador aplica um algoritmo oficial de multiplicação com pesos decrescentes nos 12 primeiros números para calcular qual deveria ser o 13º dígito. Em seguida, refaz o cálculo incluindo o 13º dígito para descobrir qual deveria ser o 14º. Se os resultados baterem com o que foi digitado, o CNPJ é considerado válido.</p>

    <h3>Aplicações práticas para o Validador</h3>
    <ul>
      <li><strong>Desenvolvimento de Software:</strong> Programadores usam validadores para criar máscaras de <i>input</i> em formulários web, garantindo que o banco de dados não receba informações corrompidas.</li>
      <li><strong>Prevenção de Fraudes em Cadastros:</strong> Ajuda a bloquear tentativas de usuários que tentam se registrar em sistemas B2B usando CNPJs falsos ou sequências como &quot;11.111.111/1111-11&quot; (que o validador bloqueia automaticamente).</li>
      <li><strong>Setor de Compras e RH:</strong> Facilita a checagem rápida antes de emitir notas fiscais ou contratos para garantir que não houve erro de digitação por parte do fornecedor.</li>
    </ul>

    <h3>Privacidade da Validação</h3>
    <p>Vale ressaltar que nossa validação ocorre <strong>offline no seu navegador</strong>. A ferramenta apenas testa a regra matemática da Receita Federal. Nós não temos acesso ao nome da empresa (Razão Social), não verificamos se o CNPJ está ativo, baixado ou inapto, nem armazenamos o número digitado em nossos servidores.</p>
  </article>
);

const faqItems = [
  {
    question: "O validador informa se a empresa está ativa?",
    answer: "Não. A validação oferecida aqui é puramente matemática. Um CNPJ pode ser matematicamente válido, mas pertencer a uma empresa que já foi fechada. Para consultar o status de um CNPJ, você deve acessar o portal da Redesim na Receita Federal."
  },
  {
    question: "Por que um CNPJ que existe deu como 'inválido'?",
    answer: "Geralmente isso ocorre por um erro de digitação em algum dos números. Se um único número dos 14 dígitos estiver errado, a conta matemática dos dígitos verificadores não fechará e a ferramenta apontará como inválido."
  },
  {
    question: "A ferramenta bloqueia o CNPJ de teste '00.000.000/0000-00'?",
    answer: "Sim, sequências repetidas (como todos os números zeros ou uns) são bloqueadas automaticamente, pois, apesar de às vezes passarem na fórmula matemática isolada, são regras de exceção da Receita Federal."
  }
];

const relatedTools = [
  {
    title: "Validador de CPF",
    url: "/documentos/validador-cpf",
    description: "Confirme se o CPF de um cliente, sócio ou funcionário está matematicamente correto."
  },
  {
    title: "Dias Úteis",
    url: "/utilidades/dias-uteis",
    description: "Calcule facilmente os dias úteis entre duas datas para pagamentos de notas fiscais e fornecedores."
  },
  {
    title: "Encurtador de URLs",
    url: "/utilidades/encurtador-url",
    description: "Encurte links longos do seu site empresarial para compartilhar de forma mais limpa com seus clientes."
  }
];

export default function ValidadorCNPJ() {
  return (
    <ToolPageLayout
      title="Validador de CNPJ"
      description="Verifique instantaneamente se um CNPJ é válido usando o algoritmo oficial da Receita Federal. Evite erros de digitação em formulários e cadastros."
      ariaLabel="Validador de CNPJ interativo"
      path="/documentos/validador-cnpj"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ValidadorCNPJClient />
    </ToolPageLayout>
  );
}
