import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import RastreioClient from './RastreioClient';

export const metadata: Metadata = {
  title: 'Rastreador de Encomendas Correios em Tempo Real | BuscaCentral',
  description: 'Rastreie suas encomendas e pacotes dos Correios em tempo real. Veja o histórico de entrega completo com atualizações instantâneas e gratuitas.',
  keywords: [
    'rastreio correios', 'rastrear encomenda', 'rastreador pacotes',
    'codigo rastreio', 'rastreamento encomendas', 'onde está meu pacote',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/rastreio' },
  openGraph: {
    title: 'Rastreador de Encomendas Correios em Tempo Real | BuscaCentral',
    description: 'Rastreie suas encomendas dos Correios em tempo real. Histórico de entrega completo e gratuito.',
    url: 'https://buscacentral.com.br/utilidades/rastreio',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rastreador de Encomendas Correios em Tempo Real | BuscaCentral',
    description: 'Rastreie suas encomendas dos Correios em tempo real. Histórico de entrega completo e gratuito.',
  },
};

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona o rastreamento?</h2>
    <p>
      O rastreador do BuscaCentral utiliza a BrasilAPI, que consolida dados logísticos
      dos Correios e outras transportadoras. Basta digitar o código de rastreio (ex: BR123456789BR)
      para ver o histórico completo de movimentações do seu pacote.
    </p>
    <h3>Como usar</h3>
    <ol>
      <li><strong>Digite o código:</strong> Insira o código de rastreio fornecido pelo remetente.</li>
      <li><strong>Clique em rastrear:</strong> A ferramenta busca as informações mais recentes.</li>
      <li><strong>Acompanhe:</strong> Veja o histórico completo de movimentações até a entrega.</li>
    </ol>
    <h3>Formato do código de rastreio</h3>
    <p>
      Códigos de rastreio dos Correios seguem o padrão: 2 letras + 9 números + 2 letras (ex: BR123456789BR).
      O primeiro par de letras indica o tipo de serviço (BR = encomenda, NX = encomenda nacional, etc.).
    </p>
  </article>
);

const faqItems = [
  {
    question: "O rastreamento funciona para todas as transportadoras?",
    answer: "Sim. A BrasilAPI consolida dados de múltiplas transportadoras, incluindo Correios, Jadlog, Total Express e outras."
  },
  {
    question: "Por que o rastreamento não aparece?",
    answer: "Pode haver um delay de algumas horas entre a postagem e a disponibilização das informações. Se o código foi inserido recentemente, aguarde um tempo e tente novamente."
  },
  {
    question: "O código de rastreio tem validade?",
    answer: "O código permanece ativo até a entrega da encomenda. Após a entrega, as informações ficam disponíveis por algum tempo, mas podem ser removidas do sistema após alguns meses."
  }
];

const relatedTools = [
  {
    title: "Busca de CEP",
    url: "/localizacao/busca-cep",
    description: "Consulte o CEP de destino para preencher o formulário de envio."
  },
  {
    title: "Distância entre Cidades",
    url: "/localizacao/distancia-cidades",
    description: "Estime a distância entre origem e destino da encomenda."
  },
  {
    title: "Dias Úteis",
    url: "/utilidades/dias-uteis",
    description: "Calcule o prazo estimado de entrega em dias úteis."
  }
];

export default function RastreioPage() {
  return (
    <ToolPageLayout
      title="Rastreador de Encomendas"
      description="Acompanhe seus pacotes dos Correios em tempo real com atualizações instantâneas."
      ariaLabel="Rastreador de encomendas interativo"
      path="/utilidades/rastreio"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <RastreioClient />
    </ToolPageLayout>
  );
}
