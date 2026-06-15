import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import JsonCsvClient from './JsonCsvClient';

export const metadata: Metadata = {
  title: 'Conversor de JSON para CSV e CSV para JSON | BuscaCentral',
  description: 'Converta arquivos JSON em CSV ou CSV em JSON de forma fácil, rápida e local no seu navegador. Ideal para desenvolvedores e analistas de dados.',
  keywords: ['json para csv', 'csv para json', 'conversor json', 'conversor csv', 'formatar dados', 'dev tools'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/json-csv' },
};

const faqItems = [
  { question: "Meus dados são enviados para algum servidor?", answer: "Não. Toda a conversão acontece localmente no seu navegador usando JavaScript. Seus dados nunca saem da sua máquina, garantindo total privacidade e segurança." },
  { question: "O JSON precisa ter algum formato específico?", answer: "Para converter JSON em CSV, o JSON deve ser um array de objetos (ex: [{\"nome\": \"Maria\"}]). Propriedades aninhadas serão convertidas em strings." },
];

const relatedTools = [
  { title: "Formatador de JSON", url: "/utilidades/formatador-codigo", description: "Formate, embeleze e valide seus arquivos JSON." },
  { title: "Codificador Base64", url: "/utilidades/base64", description: "Codifique ou decodifique strings em Base64." },
  { title: "Removedor de Duplicatas", url: "/utilidades/removedor-duplicatas", description: "Limpe suas listas e remova itens duplicados facilmente." },
];

export default function JsonCsvPage() {
  return (
    <ToolPageLayout
      title="Conversor JSON ↔ CSV"
      description="Converta dados entre os formatos JSON e CSV instantaneamente. Processamento seguro e offline."
      ariaLabel="Conversor JSON CSV interativo"
      path="/utilidades/json-csv"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <JsonCsvClient />
    </ToolPageLayout>
  );
}
