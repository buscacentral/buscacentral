import type { Metadata } from 'next';
import RegraDeTresClient from './RegraDeTresClient';

export const metadata: Metadata = {
  title: 'Calculadora de Regra de Três Simples e Inversa',
  description: 'Calcule regras de três diretamente ou inversamente proporcionais online. Veja o passo a passo da conta completo. Rápido, fácil e grátis.',
  openGraph: {
    title: 'Calculadora de Regra de Três (com passo a passo)',
    description: 'Aprenda a fazer a conta com a nossa calculadora que mostra todo o desenvolvimento da matemática.',
    url: 'https://buscacentral.com.br/utilidades/regra-de-tres',
  }
};

export default function RegraDeTresPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Calculadora de Regra de Três
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Descubra o valor de X em problemas matemáticos de proporção. Suporta regra de três simples (direta) e inversa. Exibimos o passo a passo da resolução para você aprender!
          </p>
        </header>

        <RegraDeTresClient />

        <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2>O que é a Regra de Três?</h2>
          <p>
            A Regra de Três é um método matemático usado para encontrar um quarto valor desconhecido quando se conhece três valores que têm alguma proporcionalidade entre si. É extremamente útil para o dia a dia, desde calcular descontos até prever gastos de combustível.
          </p>
          
          <h3>Regra de Três Direta (Diretamente Proporcional)</h3>
          <p>
            Usada quando as grandezas crescem ou diminuem juntas. Por exemplo: se 1 kg de carne custa R$ 40, quanto custam 3 kg? 
            Se a quantidade de carne aumenta, o preço também aumenta. (Multiplica-se em "X" ou "cruzado").
          </p>

          <h3>Regra de Três Inversa (Inversamente Proporcional)</h3>
          <p>
            Usada quando o aumento de uma grandeza causa a diminuição da outra. Por exemplo: se 2 pedreiros constroem um muro em 4 dias, 
            quantos dias 4 pedreiros levariam? Se o número de pedreiros aumenta, o tempo diminui. (Multiplica-se em linha reta).
          </p>
        </div>
      </div>
    </main>
  );
}
