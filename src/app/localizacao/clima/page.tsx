import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import ClimaClient from './ClimaClient';
import LinksRelacionados from '@/components/LinksRelacionados';

export const metadata: Metadata = {
  title: 'Previsão do Tempo de 5 Dias e Clima Atual | BuscaCentral',
  description: 'Consulte a previsão do tempo estendida de 5 dias, sensação térmica, probabilidade de chuva e clima atual de qualquer cidade gratuitamente.',
  keywords: [
    'previsão do tempo 5 dias', 'clima hoje', 'temperatura atual',
    'sensação térmica', 'probabilidade de chuva', 'condição climática', 'clima tempo'
  ],
  alternates: { canonical: 'https://buscacentral.com.br/localizacao/clima' },
  openGraph: {
    title: 'Previsão do Tempo de 5 Dias e Clima Atual | BuscaCentral',
    description: 'Consulte a previsão do tempo estendida de 5 dias, sensação térmica, probabilidade de chuva e clima atual de qualquer cidade gratuitamente.',
    url: 'https://buscacentral.com.br/localizacao/clima',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Previsão do Tempo de 5 Dias e Clima Atual | BuscaCentral',
    description: 'Consulte a previsão do tempo estendida de 5 dias, sensação térmica, probabilidade de chuva e clima atual de qualquer cidade gratuitamente.',
  },
};

export default function ClimaPage() {
  return (
    <ToolPageLayout
      title="Previsão do Tempo (5 Dias)"
      description="Consulte o clima atual, a sensação térmica e a previsão de 5 dias para qualquer região."
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

      <LinksRelacionados categoria="localizacao" paginaAtual="/localizacao/clima" />
    </ToolPageLayout>
  );
}
