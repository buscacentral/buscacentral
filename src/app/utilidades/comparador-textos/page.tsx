import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ComparadorTextosClient from './ComparadorTextosClient';

export const metadata: Metadata = generateToolMetadata(
  'Comparador de Textos',
  'Compare dois textos e veja as diferenças destacadas. Ideal para revisão de documentos e código.',
  '/utilidades/comparador-textos'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Para que serve um Comparador de Textos Online?</h2>
    <p>Revisar documentos longos manualmente em busca de alterações pode ser cansativo e sujeito a erros. O <strong>Comparador de Textos da BuscaCentral</strong> (também conhecido como ferramenta de <i>diff</i>) destaca instantaneamente o que foi adicionado, removido ou modificado entre duas versões de um mesmo conteúdo.</p>

    <h3>Como usar a ferramenta</h3>
    <ol>
      <li>Cole o texto original (versão antiga) no quadro à esquerda.</li>
      <li>Cole o texto revisado (nova versão) no quadro à direita.</li>
      <li>A ferramenta analisará os dois campos automaticamente. O que estiver destacado em <strong>vermelho</strong> significa que foi removido do texto original. O que estiver em <strong>verde</strong> foi adicionado na nova versão.</li>
    </ol>

    <h3>Quem mais se beneficia desta ferramenta?</h3>
    <ul>
      <li><strong>Escritores e Revisores:</strong> Ideal para comparar o rascunho original com a versão que voltou da editora ou do revisor, garantindo que nada importante foi cortado acidentalmente.</li>
      <li><strong>Programadores e Desenvolvedores:</strong> Perfeito para comparar trechos de código (HTML, CSS, JavaScript, etc.) e encontrar exatamente onde um ponto e vírgula ou tag foi alterado, causando um bug.</li>
      <li><strong>Advogados e RH:</strong> Facilita a revisão de minutas de contratos, permitindo ver exatamente quais cláusulas foram modificadas pela outra parte durante uma negociação.</li>
      <li><strong>Estudantes:</strong> Útil para comparar versões de trabalhos acadêmicos (TCCs, teses) após as correções dos orientadores.</li>
    </ul>

    <h3>Por que não usar o Word ou Google Docs?</h3>
    <p>Embora editores de texto possuam ferramentas de "Controlar Alterações", eles exigem que o recurso estivesse ativado <em>antes</em> de a edição começar. Se alguém enviou a você um texto já modificado sem o controle ativado, editores de texto não ajudam muito. Nossa ferramenta compara o resultado final, independentemente de como foi editado, de forma rápida e direto no navegador.</p>
  </article>
);

const faqItems = [
  {
    question: "A ferramenta de comparação salva os meus textos?",
    answer: "Não. Sabemos que você pode estar comparando códigos-fonte confidenciais ou contratos sensíveis. Todo o processamento ocorre localmente no seu computador (no seu navegador). Nenhum dado é enviado para a nuvem."
  },
  {
    question: "Posso comparar textos de tamanhos diferentes?",
    answer: "Sim! Se o texto novo tiver três parágrafos a mais que o antigo, a ferramenta alinhará as partes iguais e destacará os novos parágrafos inteiros em verde como conteúdo adicionado."
  },
  {
    question: "Existe um limite máximo de caracteres?",
    answer: "Nossa ferramenta é otimizada para lidar com textos grandes, podendo comparar milhares de palavras simultaneamente sem travar o seu navegador."
  }
];

const relatedTools = [
  {
    title: "Contador de Caracteres",
    url: "/utilidades/contador-caracteres",
    description: "Verifique o tamanho exato do seu texto revisado, contando palavras, letras e espaços."
  },
  {
    title: "Gerador de QR Code",
    url: "/utilidades/gerador-qr-code",
    description: "Transforme o link do seu texto ou documento revisado em um código QR para fácil acesso."
  },
  {
    title: "Gerador de Senha",
    url: "/utilidades/gerador-senha",
    description: "Se o texto for confidencial, proteja o arquivo com uma senha forte antes de enviar por e-mail."
  }
];

export default function ComparadorTextos() {
  return (
    <ToolPageLayout
      title="Comparador de Textos"
      description="Compare duas versões de um texto lado a lado. Identifique adições, exclusões e modificações instantaneamente. Ideal para revisão de códigos e documentos."
      ariaLabel="Comparador de textos interativo"
      path="/utilidades/comparador-textos"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ComparadorTextosClient />
    </ToolPageLayout>
  );
}
