import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import CalculadoraIMCClient from './CalculadoraIMCClient';
import AvisoSaude from '@/components/AvisoSaude';

export const metadata: Metadata = {
  title: 'Calculadora de IMC Online — Estilo de Vida Saudável | BuscaCentral',
  description: 'Simule seu Índice de Massa Corporal (IMC) de forma prática e gratuita. Ferramenta matemática para auxiliar no monitoramento do seu bem-estar e estilo de vida.',
  keywords: ['calculadora imc', 'índice massa corporal', 'peso ideal', 'estilo de vida saudável', 'bem-estar'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/calculadora-imc' },
  openGraph: {
    title: 'Calculadora de IMC Online — Estilo de Vida Saudável | BuscaCentral',
    description: 'Simule seu IMC de forma prática. Ferramenta matemática para monitoramento do bem-estar.',
    url: 'https://buscacentral.com.br/utilidades/calculadora-imc',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function CalculadoraIMC() {
  return (
    <ToolPageLayout
      title="Calculadora de IMC"
      description="Simule seu Índice de Massa Corporal de forma prática. Ferramenta matemática para monitoramento do bem-estar."
      ariaLabel="Calculadora de IMC interativa"
    >
      <CalculadoraIMCClient />
      <AvisoSaude />
    </ToolPageLayout>
  );
}
