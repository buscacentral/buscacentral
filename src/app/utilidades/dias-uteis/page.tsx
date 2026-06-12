import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import DiasUteisClient from './DiasUteisClient';

export const metadata: Metadata = generateToolMetadata(
  'Calculadora de Dias Úteis',
  'Calcule dias úteis entre duas datas considerando feriados nacionais. Ideal para prazos e entregas.',
  '/utilidades/dias-uteis'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona a Calculadora de Dias Úteis?</h2>
    <p>A <strong>Calculadora de Dias Úteis da BuscaCentral</strong> é uma ferramenta desenhada para ajudar profissionais de RH, setor financeiro, advogados e gestores de projetos a determinar com precisão o tempo real de trabalho entre duas datas, excluindo automaticamente finais de semana e feriados nacionais.</p>

    <h3>O que são considerados "Dias Úteis"?</h3>
    <p>No Brasil, conforme a legislação trabalhista e bancária padrão, os dias úteis compreendem os dias da semana de <strong>segunda-feira a sexta-feira</strong>. Sábados e domingos são descartados da contagem como dias de descanso. Além disso, feriados oficiais declarados pelo Governo Federal também são subtraídos do total.</p>

    <h3>Aplicações práticas no dia a dia</h3>
    <ul>
      <li><strong>Contratos e Boletos:</strong> Bancos e fornecedores geralmente estipulam que o pagamento deve ser feito em até "X dias úteis" após o faturamento. O não cumprimento gera multas e juros.</li>
      <li><strong>Prazos Judiciais:</strong> No meio jurídico, o Novo CPC brasileiro (Código de Processo Civil) determina que a contagem de prazos processuais deve ser feita apenas em dias úteis.</li>
      <li><strong>Gestão de Projetos:</strong> Ajuda a calcular se um "sprint" de desenvolvimento ou o prazo de entrega de um material para o cliente caberá no tempo estimado de trabalho real da equipe.</li>
      <li><strong>Logística:</strong> Prazos de entrega de transportadoras e Correios são quase sempre informados em dias úteis, não em dias corridos.</li>
    </ul>

    <h3>Como usar a ferramenta</h3>
    <p>É extremamente simples:</p>
    <ol>
      <li>Selecione a <strong>Data Inicial</strong> no primeiro calendário.</li>
      <li>Selecione a <strong>Data Final</strong> no segundo calendário.</li>
      <li>Escolha se deseja descontar os <strong>Feriados Nacionais</strong> do Brasil. Se a opção estiver marcada, a ferramenta subtrairá automaticamente datas como 7 de Setembro, 15 de Novembro, Natal, etc., caso elas caiam em dias de semana.</li>
    </ol>
  </article>
);

const faqItems = [
  {
    question: "A calculadora considera feriados estaduais ou municipais?",
    answer: "Não. Devido à imensa variedade de leis locais (são mais de 5.500 municípios no Brasil), a ferramenta desconta apenas os feriados oficiais do Governo Federal."
  },
  {
    question: "Sábado é considerado dia útil?",
    answer: "Para o cálculo de pagamentos bancários e prazos judiciais, o sábado não é dia útil. No entanto, para algumas regras específicas da CLT (como prazo para pagamento de salário), o sábado pode ser considerado útil. Nossa ferramenta segue o padrão bancário/comercial (Seg-Sex)."
  },
  {
    question: "O dia de início entra na contagem?",
    answer: "Sim. A ferramenta faz uma contagem inclusiva. Isso significa que se você colocar a data inicial e final no mesmo dia (ex: 10/10 a 10/10), o resultado será 1 dia útil (desde que não seja fim de semana ou feriado)."
  }
];

const relatedTools = [
  {
    title: "Cálculo de Distância entre Cidades",
    url: "/localizacao/distancia-cidades",
    description: "Ideal para logística: calcule a distância rodoviária e estime o tempo de viagem entre municípios."
  },
  {
    title: "Financiamento de Carro",
    url: "/financeiro/financiamento-carro",
    description: "Simule os prazos e parcelas de um financiamento utilizando os sistemas Price ou SAC."
  },
  {
    title: "Gerador de QR Code",
    url: "/utilidades/gerador-qr-code",
    description: "Crie códigos escaneáveis para compartilhar agendas, links e planilhas de projetos."
  }
];

export default function DiasUteis() {
  return (
    <ToolPageLayout
      title="Calculadora de Dias Úteis"
      description="Calcule facilmente a quantidade de dias úteis entre duas datas, excluindo finais de semana e feriados nacionais. Ideal para prazos bancários, jurídicos e logística."
      ariaLabel="Calculadora de dias úteis interativa"
      path="/utilidades/dias-uteis"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <DiasUteisClient />
    </ToolPageLayout>
  );
}
