import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ConversorImagensClient from './ConversorImagensClient';

export const metadata: Metadata = generateToolMetadata(
  'Conversor de Imagens',
  'Converta imagens entre WebP, PNG e JPG diretamente no navegador. Sem upload, processamento local.',
  '/utilidades/conversor-imagens'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Por que converter formatos de imagem?</h2>
    <p>O <strong>Conversor de Imagens da BuscaCentral</strong> permite transformar imagens entre os formatos mais utilizados na web: WebP, PNG e JPG. O processamento é feito inteiramente no navegador, sem upload para servidores externos.</p>

    <h3>Formatos suportados</h3>
    <ul>
      <li><strong>WebP:</strong> Formato moderno do Google com compressão superior (até 34% menor que JPG) mantendo qualidade. Ideal para sites.</li>
      <li><strong>PNG:</strong> Formato sem perda de qualidade, suporta transparência. Ideal para logos e ícones.</li>
      <li><strong>JPG/JPEG:</strong> Formato mais compatível, bom para fotos e imagens com muitas cores.</li>
    </ul>

    <h3>Quando converter?</h3>
    <ul>
      <li><strong>Otimização de sites:</strong> Converter fotos JPG para WebP pode reduzir o tamanho em 30-50%.</li>
      <li><strong>Transparência:</strong> Converter JPG para PNG quando precisar de fundo transparente.</li>
      <li><strong>Compatibilidade:</strong> Converter WebP para JPG quando o formato não é suportado.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "A conversão perde qualidade?",
    answer: "Depende do formato de destino. PNG é sem perda. JPG e WebP são com perda, mas a qualidade pode ser ajustada para equilibrar tamanho e aparência."
  },
  {
    question: "A imagem é enviada para um servidor?",
    answer: "Não. Todo o processamento é feito localmente no seu navegador usando a API Canvas. Nenhuma imagem sai do seu computador."
  },
  {
    question: "Posso converter múltiplas imagens de uma vez?",
    answer: "Sim. A ferramenta permite selecionar múltiplas imagens e convertê-las todas para o formato escolhido."
  }
];

const relatedTools = [
  {
    title: "Gerador de QR Code",
    url: "/utilidades/gerador-qr-code",
    description: "Gere QR Codes em PNG para uso em seus projetos."
  },
  {
    title: "Seletor de Cores",
    url: "/utilidades/seletor-cores",
    description: "Escolha cores nos formatos HEX, RGB e HSL para seus designs."
  },
  {
    title: "Base64",
    url: "/utilidades/base64",
    description: "Codifique imagens em Base64 para uso em CSS e HTML."
  }
];

export default function ConversorImagens() {
  return (
    <ToolPageLayout
      title="Conversor de Imagens"
      description="Converta imagens entre WebP, PNG e JPG diretamente no navegador. Sem upload, processamento local."
      ariaLabel="Conversor de imagens interativo"
      path="/utilidades/conversor-imagens"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ConversorImagensClient />
    </ToolPageLayout>
  );
}
