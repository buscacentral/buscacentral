import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import GeradorLoremIpsumClient from './GeradorLoremIpsumClient';

export const metadata: Metadata = {
  title: 'Gerador de Lorem Ipsum Online Grátis | BuscaCentral',
  description: 'Gere textos Lorem Ipsum para seus projetos de design e desenvolvimento. Escolha por parágrafos, palavras ou frases.',
  keywords: ['lorem ipsum', 'gerador lorem ipsum', 'texto placeholder', 'texto fictício', 'gerador texto'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/gerador-lorem-ipsum' },
  openGraph: {
    title: 'Gerador de Lorem Ipsum Online Grátis | BuscaCentral',
    description: 'Gere textos Lorem Ipsum por parágrafos, palavras ou frases.',
    url: 'https://buscacentral.com.br/utilidades/gerador-lorem-ipsum',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

const faqItems = [
  { question: "O que é Lorem Ipsum?", answer: "É um texto de preenchimento padrão usado na indústria gráfica e de design desde os anos 1500, derivado de um texto em latim de Cícero." },
  { question: "Para que serve o Lorem Ipsum?", answer: "Serve como placeholder em layouts, mockups e protótipos, permitindo avaliar o design visual sem que o conteúdo textual distraia." },
  { question: "Posso usar Lorem Ipsum em produção?", answer: "Não é recomendado. Lorem Ipsum deve ser usado apenas durante o desenvolvimento. O conteúdo final deve ser sempre o texto real do projeto." },
];

const relatedTools = [
  { title: "Formatador de Código", url: "/utilidades/formatador-codigo", description: "Formate e embeleze código HTML, CSS, JS e JSON." },
  { title: "Contador de Caracteres", url: "/utilidades/contador-caracteres", description: "Conte caracteres, palavras e linhas do seu texto." },
  { title: "Gerador de Senha", url: "/utilidades/gerador-senha", description: "Gere senhas seguras e aleatórias." },
];

export default function GeradorLoremIpsum() {
  return (
    <ToolPageLayout
      title="Gerador de Lorem Ipsum"
      description="Gere textos Lorem Ipsum para seus projetos de design e desenvolvimento. Por parágrafos, palavras ou frases."
      ariaLabel="Gerador de Lorem Ipsum interativo"
      path="/utilidades/gerador-lorem-ipsum"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <GeradorLoremIpsumClient />
    </ToolPageLayout>
  );
}
