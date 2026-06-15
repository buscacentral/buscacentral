import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import SorteadorClient from './SorteadorClient';

export const metadata: Metadata = {
  title: 'Sorteador Online Grátis | Números e Nomes | BuscaCentral',
  description: 'Sorteie números aleatórios ou nomes de uma lista de forma rápida e gratuita. Ideal para sorteios do Instagram, rifas, professores e brindes.',
  keywords: ['sorteador', 'sorteio online', 'sortear números', 'sortear nomes', 'sorteio instagram', 'número aleatório'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/sorteador' },
};

const faqItems = [
  { question: "O sorteio é realmente aleatório?", answer: "Sim, utilizamos funções criptográficas nativas do navegador para garantir a aleatoriedade justa dos resultados." },
  { question: "Posso sortear sem repetir os números?", answer: "Sim. Basta deixar a opção 'Permitir repetição' desmarcada. O sistema garantirá que todos os sorteados sejam únicos." },
];

export default function SorteadorPage() {
  return (
    <ToolPageLayout
      title="Sorteador Online"
      description="Sorteie números ou nomes de forma rápida, justa e gratuita."
      ariaLabel="Sorteador interativo"
      path="/utilidades/sorteador"
      faqItems={faqItems}
    >
      <SorteadorClient />
    </ToolPageLayout>
  );
}
