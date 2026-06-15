import type { Metadata } from 'next';
import ConsumoAguaClient from './ConsumoAguaClient';

export const metadata: Metadata = {
  title: 'Calculadora de Consumo de Água: Quantos litros beber por dia?',
  description: 'Descubra a quantidade exata de água que você deve beber por dia com base no seu peso e nível de atividade física. Proteja sua saúde e mantenha a hidratação.',
  openGraph: {
    title: 'Calculadora de Hidratação Diária',
    description: 'Beba a quantidade certa de água. Calcule sua meta de hidratação e saiba quantos copos tomar.',
    url: 'https://buscacentral.com.br/utilidades/consumo-agua',
  }
};

export default function ConsumoAguaPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Calculadora de Consumo de Água
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Não adianta beber 2 litros por dia se o seu corpo pede mais. A quantidade ideal de água depende exclusivamente do seu peso corporal e da sua rotina de exercícios.
          </p>
        </header>

        <ConsumoAguaClient />

        <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2>O Mito dos 2 Litros de Água por Dia</h2>
          <p>
            Durante anos, a regra de ouro foi "beber 2 litros de água todos os dias". Mas a ciência moderna nos mostra que <strong>a necessidade de hidratação é individual</strong>. 
            Uma pessoa de 50kg que trabalha sentada precisa de muito menos água do que um atleta de 90kg que corre diariamente.
          </p>
          
          <h3>Como funciona o cálculo?</h3>
          <p>
            O Ministério da Saúde e organizações internacionais usam uma fórmula baseada no peso para encontrar a quantidade ideal diária. Nossa calculadora ajusta esse valor usando:
          </p>
          <ul>
            <li><strong>Sedentários:</strong> 35 ml de água para cada kg de peso.</li>
            <li><strong>Praticantes moderados:</strong> 45 ml de água para cada kg de peso (compensa a perda pelo suor).</li>
            <li><strong>Atletas (Intenso):</strong> 55 ml de água para cada kg de peso.</li>
          </ul>

          <h3>Dicas para bater sua meta</h3>
          <p>
            Esquecer de beber água é comum. Para atingir sua meta calculada acima, tente <strong>espalhar o consumo ao longo do dia</strong>. Se a sua meta é 10 copos de água, beba 2 ao acordar, 2 no meio da manhã, 3 de tarde e 3 de noite. Ter uma garrafa reutilizável sempre na mesa de trabalho ou estudo é a melhor estratégia!
          </p>
        </div>
      </div>
    </main>
  );
}
