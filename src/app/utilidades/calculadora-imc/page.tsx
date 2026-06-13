import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import CalculadoraIMCClient from './CalculadoraIMCClient';
import AvisoSaude from '@/components/AvisoSaude';

export const metadata: Metadata = {
  title: 'Calculadora de IMC Online — Estilo de Vida Saudável | BuscaCentral',
  description: 'Simule seu Índice de Massa Corporal (IMC) de forma prática e gratuita. Ferramenta matemática para auxiliar no monitoramento do seu bem-estar e estilo de vida.',
  keywords: ['calculadora imc', 'índice massa corporal', 'peso ideal', 'estilo de vida saudável', 'bem-estar'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/calculadora-imc' },
  openGraph: {
    title: 'Calculadora de IMC Online — Estilo de Vida Saudável | BuscaCentral',
    description: 'Simule seu IMC de forma prática. Ferramenta matemática para monitoramento do bem-estar.',
    url: 'https://buscacentral.com.br/utilidades/calculadora-imc',
    siteName: 'BuscaCentral',
    locale: 'pt_BR',
    type: 'website',
  },
};

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Entenda o seu Índice de Massa Corporal (IMC)</h2>
    <p>A <strong>Calculadora de IMC da BuscaCentral</strong> permite estimar seu Índice de Massa Corporal em poucos segundos. Basta informar seu peso e altura para obter o resultado e entender a faixa de classificação correspondente. Desenvolvida como uma ferramenta prática, ela é ideal para quem deseja acompanhar seu bem-estar de forma simples e rápida.</p>

    <h3>O que é o IMC?</h3>
    <p>O Índice de Massa Corporal (IMC) é uma métrica estabelecida pela Organização Mundial da Saúde (OMS) para classificar o peso de uma pessoa em relação à sua altura. Ele ajuda a identificar de maneira generalizada se você está abaixo, dentro ou acima do peso recomendado.</p>

    <h3>Como utilizar a Calculadora de IMC</h3>
    <p>Usar nossa ferramenta é bastante fácil e não requer conhecimentos técnicos. Siga os passos abaixo:</p>
    <ol>
      <li><strong>Insira sua Altura:</strong> Digite sua altura em metros e centímetros (exemplo: 1,75).</li>
      <li><strong>Insira seu Peso:</strong> Informe seu peso atual em quilogramas (exemplo: 70).</li>
      <li><strong>Analise o Resultado:</strong> O sistema processará automaticamente os dados e exibirá o valor numérico exato do seu IMC, bem como a classificação em que você se encontra.</li>
    </ol>

    <h3>Benefícios de acompanhar o IMC</h3>
    <p>Manter um controle regular sobre o seu IMC oferece diversas vantagens para a manutenção de um estilo de vida mais saudável:</p>
    <ul>
      <li><strong>Prevenção:</strong> Ajuda na detecção precoce de riscos relacionados tanto ao baixo peso quanto ao sobrepeso e obesidade.</li>
      <li><strong>Metas claras:</strong> Facilita a definição de objetivos para dietas e rotinas de exercícios.</li>
      <li><strong>Autoconhecimento:</strong> Proporciona uma visão objetiva do seu corpo, servindo como ponto de partida para consultas médicas ou nutricionais.</li>
    </ul>

    <h3>Exemplos Práticos de Cálculo</h3>
    <p>Para ajudar a entender como o cálculo é feito na prática (a fórmula é o peso dividido pela altura ao quadrado), veja alguns exemplos:</p>
    <ul>
      <li><strong>Exemplo 1:</strong> Uma pessoa que pesa 65 kg e mede 1,70 m terá o cálculo: <code>65 / (1.70 x 1.70) = 22.49</code>. O resultado indica <em>Peso normal</em>.</li>
      <li><strong>Exemplo 2:</strong> Uma pessoa de 90 kg e 1,65 m terá o cálculo: <code>90 / (1.65 x 1.65) = 33.05</code>. A classificação aponta para <em>Obesidade Grau I</em>.</li>
    </ul>

    <h3>Limitações do IMC</h3>
    <p>Apesar de sua ampla utilização, é fundamental lembrar que o IMC é uma medida aproximada e não leva em conta a composição corporal exata. Ele não distingue entre a massa muscular, óssea e a gordura. Por isso, atletas e indivíduos muito musculosos podem registrar um IMC elevado sem, de fato, apresentarem excesso de gordura.</p>

    <h3>Conclusão</h3>
    <p>A nossa <strong>Calculadora de IMC</strong> é uma ferramenta introdutória valiosa para você iniciar a jornada de cuidados com a sua saúde. Use-a como um termômetro diário, mas sempre consulte profissionais qualificados (médicos e nutricionistas) para um diagnóstico completo e orientações personalizadas.</p>
  </article>
);

const faqItems = [
  {
    question: "O que significa o resultado do meu IMC?",
    answer: "O resultado do IMC classifica o seu peso atual. Menos de 18,5 indica baixo peso; entre 18,5 e 24,9 é considerado peso normal; de 25 a 29,9 é sobrepeso; e 30 ou mais indica algum grau de obesidade."
  },
  {
    question: "A calculadora de IMC serve para todas as idades?",
    answer: "A fórmula padrão do IMC é voltada para adultos a partir de 20 anos. Para crianças, adolescentes e idosos, o cálculo pode ser o mesmo, mas a interpretação (tabela de classificação) é diferente, muitas vezes exigindo curvas de crescimento específicas."
  },
  {
    question: "O IMC é uma medida precisa da minha saúde?",
    answer: "O IMC é um bom indicador geral, mas não é definitivo. Ele não diferencia massa gorda de massa magra (músculos). Por isso, uma avaliação de saúde completa exige exames laboratoriais e a análise de um profissional de saúde."
  }
];

const relatedTools = [
  {
    title: "Tabela de Calorias",
    url: "/utilidades/tabela-calorias",
    description: "Consulte as calorias dos principais alimentos para ajudar na sua dieta e planejamento alimentar."
  },
  {
    title: "Dias Úteis",
    url: "/utilidades/dias-uteis",
    description: "Calcule facilmente os dias úteis entre duas datas para planejar sua rotina."
  },
  {
    title: "Tabela FIPE",
    url: "/financeiro/tabela-fipe",
    description: "Consulte o preço médio de veículos no mercado nacional de forma rápida."
  }
];

export default function CalculadoraIMC() {
  return (
    <ToolPageLayout
      title="Calculadora de IMC"
      description="Simule seu Índice de Massa Corporal de forma prática. Ferramenta matemática para monitoramento do bem-estar."
      ariaLabel="Calculadora de IMC interativa"
      path="/utilidades/calculadora-imc"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <CalculadoraIMCClient />
      <AvisoSaude />
    </ToolPageLayout>
  );
}
