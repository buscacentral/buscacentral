import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ClimaClient from './ClimaClient';

export const metadata: Metadata = generateToolMetadata(
  'Consulta de Clima e Previsão do Tempo',
  'Consulte a temperatura, umidade e condições climáticas atuais de qualquer região do Brasil em tempo real. Dados da Open-Meteo API.',
  '/localizacao/clima'
);

export default function ClimaPage() {
  return (
    <ToolPageLayout
      title="Previsão do Tempo Instantânea"
      description="Consulte a temperatura e as condições climáticas atuais de qualquer região."
      ariaLabel="Consulta de clima interativa"
    >
      <ClimaClient />

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona a consulta de clima?</h2>
        <p>
          O BuscaCentral utiliza a API Open-Meteo, uma fonte gratuita e aberta de dados
          meteorológicos globais. Os dados incluem temperatura, umidade e velocidade do vento
          atualizados em tempo real.
        </p>
      </section>
    </ToolPageLayout>
  );
}
