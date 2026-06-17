import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import NumeroExtensoClient from './NumeroExtensoClient';

export const metadata: Metadata = generateToolMetadata(
  'Número por Extenso',
  'Escreva números e valores em reais por extenso automaticamente. Ideal para cheques, recibos e contratos. Grátis e sem cadastro.',
  '/utilidades/numero-por-extenso'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Número por Extenso: escreva valores corretamente em cheques, recibos e contratos</h2>
    <p>
      O <strong>conversor de Número por Extenso da BuscaCentral</strong> transforma qualquer número ou valor em reais
      na sua forma escrita, seguindo as regras da língua portuguesa. É a ferramenta ideal para preencher
      <strong> cheques</strong>, emitir <strong>recibos</strong>, redigir <strong>contratos</strong> e notas fiscais sem
      errar na grafia e sem dor de cabeça.
    </p>

    <h3>Como usar o conversor</h3>
    <ol>
      <li><strong>Escolha o modo:</strong> &quot;Valor em Reais&quot; para dinheiro (com centavos) ou &quot;Número&quot; para um número inteiro comum.</li>
      <li><strong>Digite o valor:</strong> pode usar ponto como separador de milhar e vírgula para os centavos (ex.: 1.250,90).</li>
      <li><strong>Copie o resultado:</strong> a versão por extenso aparece na hora, pronta para copiar e colar.</li>
    </ol>

    <h3>Por que escrever o valor por extenso?</h3>
    <p>
      Em documentos financeiros, escrever o valor por extenso é uma camada extra de segurança contra fraudes e erros de
      digitação. Se o número e o extenso divergirem, a legislação brasileira costuma dar prevalência ao
      <strong> valor escrito por extenso</strong>. Por isso cheques, recibos e contratos sempre trazem as duas formas.
    </p>

    <h3>Regras de ortografia que a ferramenta aplica para você</h3>
    <ul>
      <li><strong>&quot;Cem&quot; x &quot;cento&quot;:</strong> usa-se &quot;cem&quot; para exatamente 100 e &quot;cento&quot; a partir de 101 (ex.: &quot;cento e cinquenta&quot;).</li>
      <li><strong>O conector &quot;e&quot;:</strong> liga centenas, dezenas e unidades (ex.: &quot;duzentos e trinta e quatro&quot;).</li>
      <li><strong>&quot;De reais&quot;:</strong> valores exatos em milhão ou bilhão pedem a preposição &quot;de&quot; (ex.: &quot;um milhão de reais&quot;).</li>
      <li><strong>&quot;Mil&quot; é invariável:</strong> não existe &quot;um mil&quot; — escreve-se apenas &quot;mil&quot;.</li>
    </ul>

    <h3>Exemplos práticos</h3>
    <ul>
      <li><strong>R$ 1.234,56</strong> → mil, duzentos e trinta e quatro reais e cinquenta e seis centavos</li>
      <li><strong>R$ 100,00</strong> → cem reais</li>
      <li><strong>R$ 1.000.000,00</strong> → um milhão de reais</li>
      <li><strong>2025</strong> → dois mil e vinte e cinco</li>
    </ul>

    <p>
      Todo o processamento acontece <strong>diretamente no seu navegador</strong>: nada do que você digita é enviado ou
      armazenado nos nossos servidores.
    </p>
  </article>
);

const faqItems = [
  {
    question: 'O valor por extenso tem validade legal em cheques e recibos?',
    answer:
      'Sim. Em documentos como cheques e contratos, o valor escrito por extenso funciona como confirmação do valor numérico. Em caso de divergência entre o número e o extenso, costuma prevalecer o que está escrito por extenso, justamente para evitar fraudes e erros de digitação.',
  },
  {
    question: 'Devo escrever "um mil" ou apenas "mil"?',
    answer:
      'O correto é escrever apenas "mil". A palavra "mil" é invariável e não é precedida de "um". Portanto, R$ 1.000,00 se escreve "mil reais", e não "um mil reais". A ferramenta já aplica essa regra automaticamente.',
  },
  {
    question: 'Quando uso "de reais" (ex.: um milhão de reais)?',
    answer:
      'A preposição "de" aparece quando o valor termina exatamente em milhão, bilhão ou trilhão, sem grupos menores. Assim, R$ 1.000.000,00 é "um milhão de reais", mas R$ 1.500.000,00 é "um milhão e quinhentos mil reais" (sem o "de").',
  },
  {
    question: 'A ferramenta funciona com centavos?',
    answer:
      'Sim. No modo "Valor em Reais", basta digitar o valor com a vírgula dos centavos (ex.: 1.250,90) que a ferramenta gera o texto completo, separando reais e centavos corretamente.',
  },
];

const relatedTools = [
  {
    title: 'Gerador de Recibos',
    url: '/documentos/gerador-recibos',
    description: 'Crie recibos de pagamento profissionais com o valor já escrito por extenso automaticamente.',
  },
  {
    title: 'Calculadora de Porcentagem',
    url: '/utilidades/calculadora-porcentagem',
    description: 'Calcule porcentagens, acréscimos e descontos de forma rápida e precisa.',
  },
  {
    title: 'Formatador em Lote',
    url: '/utilidades/formatador-dados',
    description: 'Limpe e formate grandes listas de CPFs, CNPJs e telefones instantaneamente.',
  },
];

export default function NumeroPorExtensoPage() {
  return (
    <ToolPageLayout
      title="Número por Extenso"
      description="Converta números e valores em reais para a forma por extenso. Perfeito para preencher cheques, recibos e contratos sem errar."
      ariaLabel="Conversor de número por extenso interativo"
      path="/utilidades/numero-por-extenso"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <NumeroExtensoClient />
    </ToolPageLayout>
  );
}
