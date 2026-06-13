import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import SeletorCoresClient from './SeletorCoresClient';

export const metadata: Metadata = generateToolMetadata(
  'Seletor de Cores',
  'Escolha e combine cores em HEX, RGB e HSL. Gere paletas e esquemas para seus projetos.',
  '/utilidades/seletor-cores'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Por que usar um Seletor de Cores?</h2>
    <p>O <strong>Seletor de Cores da BuscaCentral</strong> é uma ferramenta essencial para designers, desenvolvedores e qualquer pessoa que precise escolher cores para projetos visuais. Escolha cores nos formatos HEX, RGB e HSL com preview em tempo real.</p>

    <h3>Formatos de cor suportados</h3>
    <ul>
      <li><strong>HEX:</strong> Código hexadecimal (ex: #FF5733). Padrão na web para CSS e design.</li>
      <li><strong>RGB:</strong> Valores de Vermelho, Verde e Azul (ex: rgb(255, 87, 51)). Comum em editores de imagem.</li>
      <li><strong>HSL:</strong> Matiz, Saturação e Luminosidade (ex: hsl(14, 100%, 60%)). Mais intuitivo para ajustes.</li>
    </ul>

    <h3>Para que serve?</h3>
    <ul>
      <li><strong>Web design:</strong> Escolha cores para sites, botões e textos.</li>
      <li><strong>Gráficos e apresentações:</strong> Crie paletas harmoniosas.</li>
      <li><strong>Artes gráficas:</strong> Selecione cores exatas para impressão.</li>
      <li><strong>Identidade visual:</strong> Defina as cores oficiais da sua marca.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "Qual a diferença entre HEX e RGB?",
    answer: "HEX usa notação hexadecimal (6 caracteres), enquanto RGB usa valores decimais (0-255) para cada canal de cor. Ambos representam a mesma cor, mas HEX é mais compacto."
  },
  {
    question: "O que é HSL?",
    answer: "HSL significa Matiz (Hue), Saturação (Saturation) e Luminosidade (Lightness). É um modelo mais intuitivo, onde você ajusta a 'cor pura', sua 'intensidade' e se está 'clara ou escura'."
  },
  {
    question: "Posso copiar o código da cor selecionada?",
    answer: "Sim. Basta clicar no ícone de copiar ao lado do código da cor escolhida. O código é copiado na formatação correta para uso direto em CSS."
  }
];

const relatedTools = [
  {
    title: "Conversor de Imagens",
    url: "/utilidades/conversor-imagens",
    description: "Converta imagens para usar as cores exatas nos seus projetos."
  },
  {
    title: "Formatador JSON/XML",
    url: "/utilidades/formatador-codigo",
    description: "Formate código CSS contendo cores nos formatos HEX, RGB ou HSL."
  },
  {
    title: "Gerador de QR Code",
    url: "/utilidades/gerador-qr-code",
    description: "Gere QR Codes com as cores da sua identidade visual."
  }
];

export default function SeletorCores() {
  return (
    <ToolPageLayout
      title="Seletor de Cores"
      description="Escolha e combine cores em HEX, RGB e HSL. Gere paletas e esquemas para seus projetos."
      ariaLabel="Seletor de cores interativo"
      path="/utilidades/seletor-cores"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <SeletorCoresClient />
    </ToolPageLayout>
  );
}
