import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ROIImobiliarioClient from './ROIImobiliarioClient';
import LinksRelacionados from '@/components/LinksRelacionados';

export const metadata: Metadata = generateToolMetadata(
  'Calculadora de ROI Imobiliário',
  'Calcule o Cap Rate e o ROI anual do seu investimento imobiliário. Descubra o retorno real considerando aluguel e valorização do imóvel.',
  '/financeiro/roi-imobiliario'
);

export default function ROIImobiliario() {
  return (
    <ToolPageLayout
      title="Calculadora de ROI Imobiliário"
      description="Descubra o potencial de lucro do seu imóvel medindo o Cap Rate e o Retorno sobre o Investimento."
      ariaLabel="Calculadora de ROI imobiliário interativa"
    >
      <ROIImobiliarioClient />

      <section className="mt-12 prose prose-gray max-w-none">
        <h2>O que é Cap Rate?</h2>
        <p>
          O Cap Rate (Capitalization Rate) é o indicador que mostra o rendimento bruto anual
          de um imóvel com base no aluguel, desconsiderando a valorização. Um Cap Rate acima
          de 6% ao ano é considerado bom no mercado brasileiro.
        </p>
        <h2>O que é ROI Imobiliário?</h2>
        <p>
          O ROI (Return on Investment) considera não apenas o aluguel líquido, mas também a
          valorização patrimonial do imóvel. É o indicador mais completo para avaliar se um
          investimento imobiliário vale a pena comparado a outras aplicações.
        </p>
      </section>

      <LinksRelacionados categoria="financeiro" paginaAtual="/financeiro/roi-imobiliario" />
    </ToolPageLayout>
  );
}
