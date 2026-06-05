import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import ClimaClient from './ClimaClient';

export const metadata: Metadata = {
  title: 'Previsão do Tempo e Condição Climática Instantânea | BuscaCentral',
  description: 'Consulte o clima, temperatura atual, umidade e velocidade do vento de qualquer região em tempo real com nosso simulador meteorológico gratuito.',
  keywords: [
    'previsão do tempo', 'clima hoje', 'temperatura atual',
    'umidade relativa', 'velocidade vento', 'condição climática',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/localizacao/clima' },
  openGraph: {
    title: 'Previsão do Tempo e Condição Climática Instantânea | BuscaCentral',
    description: 'Consulte o clima, temperatura atual, umidade e velocidade do vento de qualquer região em tempo real.',
    url: 'https://buscacentral.com.br/localizacao/clima',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Previsão do Tempo e Condição Climática Instantânea | BuscaCentral',
    description: 'Consulte o clima, temperatura atual, umidade e velocidade do vento de qualquer região em tempo real.',
  },
};

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
