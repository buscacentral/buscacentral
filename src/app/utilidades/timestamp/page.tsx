import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import TimestampClient from './TimestampClient';

export const metadata: Metadata = generateToolMetadata(
  'Conversor de Timestamp',
  'Converta entre timestamp Unix e data/hora legível. Conversão bidirecional instantânea.',
  '/utilidades/timestamp'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>O que é um Timestamp Unix?</h2>
    <p>O <strong>Timestamp Unix</strong> é a quantidade de segundos (ou milissegundos) decorridos desde 1 de janeiro de 1970, às 00:00:00 UTC (conhecido como &quot;Epoch&quot;). É amplamente usado em programação, bancos de dados e APIs para representar datas e horários de forma numérica.</p>

    <h3>Como usar o conversor</h3>
    <ol>
      <li><strong>Timestamp → Data:</strong> Cole um timestamp Unix (em segundos ou milissegundos) e veja a data e hora correspondentes.</li>
      <li><strong>Data → Timestamp:</strong> Selecione uma data e horário para obter o timestamp Unix equivalente.</li>
      <li><strong>Timestamp atual:</strong> Veja o timestamp em tempo real, atualizado a cada segundo.</li>
    </ol>

    <h3>Quando usar timestamps?</h3>
    <ul>
      <li><strong>Programação:</strong> Registros de criação/modificação em bancos de dados.</li>
      <li><strong>APIs:</strong> Parâmetros de data em requisições REST.</li>
      <li><strong>Logs de sistema:</strong> Marcação temporal de eventos.</li>
      <li><strong>Análise de dados:</strong> Processamento de séries temporais.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "Qual a diferença entre timestamp em segundos e milissegundos?",
    answer: "Timestamps em segundos têm 10 dígitos (ex: 1700000000). Timestamps em milissegundos têm 13 dígitos (ex: 1700000000000). A ferramenta detecta automaticamente o formato."
  },
  {
    question: "O que é a Epoch?",
    answer: "A Epoch é o ponto de partida do sistema Unix: 1 de janeiro de 1970, às 00:00:00 UTC. Todos os timestamps Unix são contados a partir desse momento."
  },
  {
    question: "Timestamps funcionam em qualquer fuso horário?",
    answer: "O timestamp Unix é absoluto e não depende de fuso horário. A conversão para data/hora pode ser feita em UTC ou no fuso horário local do seu navegador."
  }
];

const relatedTools = [
  {
    title: "Dias Úteis",
    url: "/utilidades/dias-uteis",
    description: "Calcule a diferença em dias úteis entre duas datas."
  },
  {
    title: "Base64",
    url: "/utilidades/base64",
    description: "Codifique timestamps ou outros dados em Base64."
  },
  {
    title: "Formatador JSON/XML",
    url: "/utilidades/formatador-codigo",
    description: "Formate JSON com timestamps para exibição."
  }
];

export default function Timestamp() {
  return (
    <ToolPageLayout
      title="Conversor de Timestamp"
      description="Converta entre timestamp Unix e data/hora legível. Conversão bidirecional instantânea."
      ariaLabel="Conversor de timestamp interativo"
      path="/utilidades/timestamp"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <TimestampClient />
    </ToolPageLayout>
  );
}
