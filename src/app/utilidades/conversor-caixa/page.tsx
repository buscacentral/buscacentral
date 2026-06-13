import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ConversorCaixaClient from './ConversorCaixaClient';

export const metadata: Metadata = generateToolMetadata(
  'Conversor de Caixa',
  'Converta texto entre maiúsculo, minúsculo, capitalizado e alternado. Transformação instantânea e gratuita.',
  '/utilidades/conversor-caixa'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>O que é o Conversor de Caixa?</h2>
    <p>O <strong>Conversor de Caixa da BuscaCentral</strong> permite transformar texto entre diferentes formatos de capitalização de forma instantânea. Ideal para corrigir erros de digitação, padronizar textos e adaptar conteúdo para diferentes contextos.</p>

    <h3>Formatos disponíveis</h3>
    <ul>
      <li><strong>Maiúsculo:</strong> Converte todo o texto para letras maiúsculas. EX: &quot;TEXTO EM MAIÚSCULO&quot;.</li>
      <li><strong>Minúsculo:</strong> Converte todo o texto para letras minúsculas. Ex: &quot;texto em minúsculo&quot;.</li>
      <li><strong>Capitalizado:</strong> Primeira letra de cada palavra em maiúscula. Ex: &quot;Texto Capitalizado&quot;.</li>
      <li><strong>Alternado:</strong> Alterna entre maiúsculo e minúsculo. Ex: &quot;tExTo AlTeRnAdO&quot;.</li>
    </ul>

    <h3>Quando usar?</h3>
    <ul>
      <li><strong>Títulos:</strong> Padronize títulos de artigos e posts.</li>
      <li><strong>Código:</strong> Converta nomes de variáveis para o padrão do seu projeto.</li>
      <li><strong>Documentos:</strong> Corrija textos copiados de fontes com formatação diferente.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "A conversão altera acentos e caracteres especiais?",
    answer: "Não. A ferramenta preserva todos os caracteres originais, incluindo acentos, cedilha e caracteres especiais do português."
  },
  {
    question: "Posso converter textos longos?",
    answer: "Sim. A ferramenta processa textos de qualquer tamanho diretamente no navegador, sem limites práticos."
  },
  {
    question: "A transformação é reversível?",
    answer: "Sim. Você pode alternar entre os formatos quantas vezes quiser, copiando o resultado a cada etapa."
  }
];

const relatedTools = [
  {
    title: "Contador de Caracteres",
    url: "/utilidades/contador-caracteres",
    description: "Verifique o tamanho do texto após a conversão."
  },
  {
    title: "Comparador de Textos",
    url: "/utilidades/comparador-textos",
    description: "Compare o texto original com a versão convertida."
  },
  {
    title: "Formatador JSON/XML",
    url: "/utilidades/formatador-codigo",
    description: "Formate código após ajustar a capitalização."
  }
];

export default function ConversorCaixa() {
  return (
    <ToolPageLayout
      title="Conversor de Caixa"
      description="Converta texto entre maiúsculo, minúsculo, capitalizado e alternado. Transformação instantânea e gratuita."
      ariaLabel="Conversor de caixa de texto interativo"
      path="/utilidades/conversor-caixa"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ConversorCaixaClient />
    </ToolPageLayout>
  );
}
