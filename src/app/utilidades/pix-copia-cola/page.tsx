import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import PIXCopiaColaClient from './PIXCopiaColaClient';

export const metadata: Metadata = generateToolMetadata(
  'PIX Copia e Cola',
  'Gere códigos PIX no padrão EMV para recebimentos. Copia e cola para qualquer banco.',
  '/utilidades/pix-copia-cola'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>O que é o código PIX Copia e Cola?</h2>
    <p>O <strong>PIX Copia e Cola da BuscaCentral</strong> gera o código no padrão EMV (Europay, Mastercard, Visa) utilizado pelos bancos brasileiros para o sistema PIX. Esse código pode ser copiado e colado em qualquer aplicativo bancário para realizar um pagamento instantâneo.</p>

    <h3>Como usar o gerador</h3>
    <ol>
      <li><strong>Chave PIX:</strong> Informe a chave PIX (CPF, CNPJ, e-mail, telefone ou chave aleatória).</li>
      <li><strong>Valor (opcional):</strong> Se desejar, defina o valor exato do pagamento.</li>
      <li><strong>Nome do recebedor:</strong> Digite o nome de quem receberá o pagamento.</li>
      <li><strong>Cidade:</strong> Informe a cidade do recebedor (máximo 15 caracteres).</li>
      <li><strong>Gere o código:</strong> A ferramenta gera o código PIX completo para copiar e colar.</li>
    </ol>

    <h3>Quando usar o PIX Copia e Cola?</h3>
    <ul>
      <li><strong>Lojas virtuais:</strong> Exibir o código para clientes que não escaneiam QR Code.</li>
      <li><strong>Marketplaces:</strong> Gerar códigos para pagamentos manuais.</li>
      <li><strong>Suporte ao cliente:</strong> Enviar o código por WhatsApp ou e-mail quando o QR Code não funciona.</li>
      <li><strong>Automação:</strong> Sistemas que precisam gerar códigos PIX programaticamente.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "O código PIX gerado funciona em qualquer banco?",
    answer: "Sim. O código é gerado no padrão EMV, que é o formato oficial utilizado por todos os bancos e carteiras digitais do Brasil."
  },
  {
    question: "Posso definir o valor no código?",
    answer: "Sim. Se informar um valor, o código conterá esse valor fixo. Se deixar em branco, o pagamento será aberto (o valor será definido ao colar no app bancário)."
  },
  {
    question: "O código PIX tem validade?",
    answer: "Códigos PIX estáticos (sem valor definido) não expiram. Códigos com valor podem ter validade conforme a política do banco emissor."
  }
];

const relatedTools = [
  {
    title: "Gerador de QR Code",
    url: "/utilidades/gerador-qr-code",
    description: "Gere um QR Code a partir do código PIX para exibir em lojas físicas."
  },
  {
    title: "Link WhatsApp",
    url: "/utilidades/whatsapp-link",
    description: "Envie o código PIX diretamente pelo WhatsApp com mensagem pré-definida."
  },
  {
    title: "Cotação de Moedas",
    url: "/financeiro/cotacao",
    description: "Acompanhe a cotação do dólar para pagamentos internacionais."
  }
];

export default function PIXCopiaCola() {
  return (
    <ToolPageLayout
      title="PIX Copia e Cola"
      description="Gere códigos PIX no padrão EMV para recebimentos. Copia e cola para qualquer banco."
      ariaLabel="Gerador de PIX copia e cola interativo"
      path="/utilidades/pix-copia-cola"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <PIXCopiaColaClient />
    </ToolPageLayout>
  );
}
