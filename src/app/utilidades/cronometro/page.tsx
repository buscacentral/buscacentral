import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import CronometroClient from './CronometroClient';

export const metadata: Metadata = {
  title: 'Cronômetro Online e Temporizador Grátis | BuscaCentral',
  description: 'Cronômetro preciso com registro de voltas e temporizador (timer) com alarme. Use direto no navegador, sem instalar nada.',
  keywords: ['cronômetro online', 'timer online', 'temporizador', 'contagem regressiva', 'alarme online'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/cronometro' },
};

const faqItems = [
  { question: "O timer funciona em segundo plano?", answer: "Sim, mas devido a restrições dos navegadores modernos para economizar bateria, o tempo pode atrasar um pouco se a aba ficar inativa por muito tempo. Para precisão exata, mantenha a janela aberta." },
  { question: "O alarme toca sozinho?", answer: "Sim. Quando a contagem regressiva chegar a zero, um sinal sonoro será emitido." },
];

export default function CronometroPage() {
  return (
    <ToolPageLayout
      title="Cronômetro e Temporizador"
      description="Meça o tempo com precisão ou configure uma contagem regressiva com alarme sonoro."
      ariaLabel="Cronômetro interativo"
      path="/utilidades/cronometro"
      faqItems={faqItems}
    >
      <CronometroClient />
    </ToolPageLayout>
  );
}
