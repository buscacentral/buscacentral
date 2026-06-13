import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import TabelaCaloriasClient from './TabelaCaloriasClient';
import AvisoSaude from '@/components/AvisoSaude';

export const metadata: Metadata = {
  title: 'Tabela de Calorias dos Alimentos — Guia de Nutrição Prático | BuscaCentral',
  description: 'Consulte calorias e nutrientes de 200 alimentos brasileiros. Ferramenta prática para planejar refeições e acompanhar seu estilo de vida saudável.',
  keywords: ['tabela calorias', 'calorias alimentos', 'nutrição', 'alimentação saudável', 'bem-estar', 'TACO'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/tabela-calorias' },
  openGraph: {
    title: 'Tabela de Calorias dos Alimentos — Guia de Nutrição Prático | BuscaCentral',
    description: 'Consulte calorias e nutrientes de 200 alimentos brasileiros. Ferramenta prática para estilo de vida saudável.',
    url: 'https://buscacentral.com.br/utilidades/tabela-calorias',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como consultar calorias na BuscaCentral?</h2>
    <p>A <strong>Tabela de Calorias da BuscaCentral</strong> reúne dados nutricionais de 200 alimentos brasileiros, baseados na tabela TACO (Tabela Brasileira de Composição de Alimentos) do IBGE. Consulte rapidamente calorias, proteínas, carboidratos e gorduras de qualquer alimento.</p>

    <h3>Como usar</h3>
    <ol>
      <li><strong>Pesquise:</strong> Digite o nome do alimento no campo de busca.</li>
      <li><strong>Selecione:</strong> Escolha a porção desejada na lista de resultados.</li>
      <li><strong>Veja os dados:</strong> A tabela exibe calorias, proteínas, carboidratos, gorduras e fibras por porção.</li>
    </ol>

    <h3>Por que consultar calorias?</h3>
    <ul>
      <li><strong>Planejamento alimentar:</strong> Monte refeições equilibradas sabendo a quantidade de cada nutriente.</li>
      <li><strong>Controle de peso:</strong> Acompanhe a ingestão calórica diária para emagrecer ou ganhar massa muscular.</li>
      <li><strong>Saúde:</strong> Reduza o consumo de alimentos muito calóricos ou ricos em gordura saturada.</li>
      <li><strong>Athletismo:</strong> Atletas precisam calibrar a ingestão de macronutrientes conforme a fase de treino.</li>
    </ul>

    <h3>Fonte dos dados</h3>
    <p>
      Todos os valores são extraídos da tabela TACO (Tabela Brasileira de Composição de Alimentos),
      elaborada pelo Núcleo de Pesquisas em Alimentação da Universidade Estadual de Campinas (UNICAMP)
      e disponibilizada pelo IBGE.
    </p>
  </article>
);

const faqItems = [
  {
    question: "Os valores são precisos?",
    answer: "Sim. Os dados são baseados na tabela TACO do IBGE, que é a referência oficial de composição nutricional de alimentos no Brasil."
  },
  {
    question: "Posso usar para dietas específicas?",
    answer: "Sim. A tabela fornece dados de macronutrientes (proteínas, carboidratos, gorduras) que permitem montar dietas personalizadas com orientação nutricional."
  },
  {
    question: "Quantos alimentos estão na tabela?",
    answer: "A tabela contém mais de 200 alimentos brasileiros, incluindo frutas, legumes, carnes, grãos, laticínios e alimentos processados."
  }
];

const relatedTools = [
  {
    title: "Calculadora de IMC",
    url: "/utilidades/calculadora-imc",
    description: "Calcule seu índice de massa corporal para orientar sua dieta."
  },
  {
    title: "Dias Úteis",
    url: "/utilidades/dias-uteis",
    description: "Planeje seus dias de refeição e treino."
  },
  {
    title: "Contador de Caracteres",
    url: "/utilidades/contador-caracteres",
    description: "Conte caracteres para posts sobre nutrição nas redes sociais."
  }
];

export default function TabelaCalorias() {
  return (
    <ToolPageLayout
      title="Tabela de Calorias"
      description="Consulte calorias e nutrientes de 200 alimentos brasileiros. Ferramenta prática para planejar refeições."
      ariaLabel="Tabela de calorias interativa"
      path="/utilidades/tabela-calorias"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <TabelaCaloriasClient />
      <AvisoSaude />
    </ToolPageLayout>
  );
}
