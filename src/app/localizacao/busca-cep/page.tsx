import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import BuscaCEPClient from './BuscaCEPClient';

export const metadata: Metadata = generateToolMetadata(
  'Busca de CEP',
  'Consulte endereços completos por CEP ou busque CEPs por nome de rua. Dados do ViaCEP em tempo real.',
  '/localizacao/busca-cep'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como consultar CEP na BuscaCentral?</h2>
    <p>A <strong>Busca de CEP da BuscaCentral</strong> é uma ferramenta rápida e gratuita que permite consultar endereços completos a partir de um CEP, ou encontrar o CEP de qualquer rua do Brasil. Utiliza a API ViaCEP para garantir dados atualizados e precisos.</p>

    <h3>Busca por CEP</h3>
    <p>Digite o CEP no formato 00000-000 ou 00000000 e a ferramenta retorna automaticamente: logradouro, bairro, cidade, estado e código IBGE. Ideal para preencher formulários de entrega, cadastros e notas fiscais.</p>

    <h3>Busca reversa por endereço</h3>
    <p>Não sabe o CEP? Digite o nome da rua + cidade e a ferramenta lista todos os CEPs correspondentes. Perfeito para quem está se mudando ou precisa confirmar o CEP correto antes de enviar uma encomenda.</p>

    <h3>Formatos aceitos</h3>
    <p>A ferramenta aceita CEPs com ou sem pontuação: <code>01310-100</code> ou <code>01310100</code>. Ambos retornam o mesmo resultado.</p>

    <h3>Por que o CEP é importante?</h3>
    <ul>
      <li><strong>Frete e entregas:</strong> Lojas online precisam do CEP correto para calcular o custo de envio.</li>
      <li><strong>Cadastros:</strong> Formulários governamentais, bancários e comerciais exigem o CEP do endereço completo.</li>
      <li><strong>Logística:</strong> Empresas de transporte usam o CEP para roteirizar entregas.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "A busca de CEP funciona para todo o Brasil?",
    answer: "Sim. A API ViaCEP cobre todos os CEPs válidos do território nacional, desde capitais até cidades pequenas."
  },
  {
    question: "O que significam as siglas dos estados no resultado?",
    answer: "As duas letras indicam a unidade federativa (UF). Exemplo: SP = São Paulo, RJ = Rio de Janeiro, MG = Minas Gerais."
  },
  {
    question: "Por que a busca reversa retorna mais de um CEP?",
    answer: "Uma mesma rua pode ter CEPs diferentes dependendo do trecho (lado par, lado ímpar, número). A ferramenta lista todos os CEPs associados ao endereço informado."
  }
];

const relatedTools = [
  {
    title: "Distância entre Cidades",
    url: "/localizacao/distancia-cidades",
    description: "Calcule a distância rodoviária entre duas cidades brasileiras."
  },
  {
    title: "Clima",
    url: "/localizacao/clima",
    description: "Consulte a previsão do tempo para qualquer cidade do Brasil."
  },
  {
    title: "Rastreio",
    url: "/utilidades/rastreio",
    description: "Rastreie encomendas dos Correios usando o código de rastreio."
  }
];

export default function BuscaCEP() {
  return (
    <ToolPageLayout
      title="Busca de CEP"
      description="Consulte endereços por CEP ou busque CEPs por endereço usando a API ViaCEP."
      ariaLabel="Busca de CEP interativa"
      path="/localizacao/busca-cep"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <BuscaCEPClient />
    </ToolPageLayout>
  );
}
