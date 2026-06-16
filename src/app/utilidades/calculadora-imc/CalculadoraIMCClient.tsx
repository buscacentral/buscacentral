'use client';

import { useState, useMemo } from 'react';
import { ResultCard } from '@/components/ui/ResultCard';
import { EmptyState } from '@/components/ui/EmptyState';

function getClassificacao(imc: number): { label: string; cor: string; bg: string; border: string } {
  if (imc < 18.5) return { label: 'Abaixo do Peso', cor: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  if (imc < 25) return { label: 'Peso Normal', cor: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
  if (imc < 30) return { label: 'Sobrepeso', cor: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
  if (imc < 35) return { label: 'Obesidade Grau I', cor: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
  if (imc < 40) return { label: 'Obesidade Grau II', cor: 'text-red-800', bg: 'bg-red-100', border: 'border-red-300' };
  return { label: 'Obesidade Grau III', cor: 'text-red-900', bg: 'bg-red-200', border: 'border-red-400' };
}

function getBarPosition(imc: number): number {
  if (imc <= 15) return 0;
  if (imc >= 45) return 100;
  return ((imc - 15) / 30) * 100;
}

export default function CalculadoraIMCClient() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');

  const resultado = useMemo(() => {
    const p = parseFloat(peso.replace(',', '.')) || 0;
    let a = parseFloat(altura.replace(',', '.')) || 0;
    if (a > 10) a = a / 100;
    if (p <= 0 || a <= 0 || a > 3) return null;

    const imc = p / (a * a);
    const classificacao = getClassificacao(imc);
    const pesoMinimo = 18.5 * a * a;
    const pesoMaximo = 24.9 * a * a;
    const pesoIdeal = 22 * a * a;
    const posicao = getBarPosition(imc);

    const diffParaIdeal = p - pesoIdeal;
    const textoDiff = diffParaIdeal > 0
      ? `Acima do ideal em ${diffParaIdeal.toFixed(1)} kg`
      : `Abaixo do ideal em ${Math.abs(diffParaIdeal).toFixed(1)} kg`;

    let tmb = 0;
    const idadeNum = parseInt(idade) || 0;
    if (sexo && idadeNum > 0) {
      if (sexo === 'Masculino') {
        tmb = 88.362 + (13.397 * p) + (4.799 * (a * 100)) - (5.677 * idadeNum);
      } else {
        tmb = 447.593 + (9.247 * p) + (3.098 * (a * 100)) - (4.330 * idadeNum);
      }
    }

    return { imc, classificacao, pesoMinimo, pesoMaximo, pesoIdeal, posicao, alturaM: a, diffParaIdeal, textoDiff, tmb };
  }, [peso, altura, sexo, idade]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
            <input
              type="text"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ex: 75"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm ou m)</label>
            <input
              type="text"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              placeholder="Ex: 175 ou 1.75"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo (opcional)</label>
            <div className="flex gap-2">
              {['Masculino', 'Feminino'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSexo(sexo === s ? '' : s)}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                    sexo === s ? 'bg-blue-600 text-white shadow-md scale-[1.02]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Idade (opcional)</label>
            <input
              type="number"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder="Ex: 30"
              min="1"
              max="120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {resultado ? (
        <div className="space-y-4">
          <div className={`rounded-xl p-6 text-center border ${resultado.classificacao.bg} ${resultado.classificacao.border}`}>
            <p className="text-sm text-gray-500 mb-1">Seu IMC</p>
            <p className={`text-5xl font-bold ${resultado.classificacao.cor}`}>
              {resultado.imc.toFixed(1)}
            </p>
            <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold border ${resultado.classificacao.bg} ${resultado.classificacao.cor} ${resultado.classificacao.border}`}>
              {resultado.classificacao.label}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-3">Escala IMC (OMS)</p>
            <div className="relative h-6 rounded-full overflow-hidden bg-gray-100">
              <div className="absolute inset-0 flex">
                <div className="h-full bg-yellow-300" style={{ width: '25%' }} />
                <div className="h-full bg-green-400" style={{ width: '22%' }} />
                <div className="h-full bg-orange-400" style={{ width: '17%' }} />
                <div className="h-full bg-red-400" style={{ width: '17%' }} />
                <div className="h-full bg-red-600" style={{ width: '19%' }} />
              </div>
              <div
                className="absolute top-0 h-full w-1 bg-gray-900 rounded"
                style={{ left: `${resultado.posicao}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>15</span>
              <span>18,5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
              <p className="text-sm text-gray-500 mb-1">Peso Ideal</p>
              <p className="text-2xl font-bold text-blue-700">{resultado.pesoIdeal.toFixed(1)} kg</p>
              <p className="text-xs text-gray-400 mt-1">IMC 22 (ideal)</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
              <p className="text-sm text-gray-500 mb-1">Faixa Saudável</p>
              <p className="text-lg font-bold text-green-700">{resultado.pesoMinimo.toFixed(1)} — {resultado.pesoMaximo.toFixed(1)} kg</p>
              <p className="text-xs text-gray-400 mt-1">IMC 18,5 a 24,9</p>
            </div>
          </div>

          <div className={`rounded-xl p-5 text-center border ${resultado.diffParaIdeal > 0 ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
            <p className="text-sm text-gray-600 mb-1">Para atingir o peso ideal</p>
            <p className={`text-xl font-bold ${resultado.diffParaIdeal > 0 ? 'text-orange-700' : 'text-blue-700'}`}>
              {resultado.textoDiff}
            </p>
          </div>

          {resultado.tmb > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
              <p className="text-sm text-gray-500 mb-1">Taxa Metabólica Basal (TMB)</p>
              <p className="text-2xl font-bold text-purple-700">{resultado.tmb.toFixed(0)} kcal/dia</p>
              <p className="text-xs text-gray-400 mt-1">Fórmula de Harris-Benedict — calorias que seu corpo em repouso</p>
            </div>
          )}

          <ResultCard title="Detalhes da Avaliação" className="p-0 border-0 shadow-none bg-transparent">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Classificação OMS</h3>
            <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <tbody>
                {[
                  { faixa: 'Abaixo de 18,5', label: 'Abaixo do Peso', color: 'bg-yellow-100 text-yellow-800' },
                  { faixa: '18,5 — 24,9', label: 'Peso Normal', color: 'bg-green-100 text-green-800' },
                  { faixa: '25,0 — 29,9', label: 'Sobrepeso', color: 'bg-orange-100 text-orange-800' },
                  { faixa: '30,0 — 34,9', label: 'Obesidade Grau I', color: 'bg-red-100 text-red-800' },
                  { faixa: '35,0 — 39,9', label: 'Obesidade Grau II', color: 'bg-red-200 text-red-900' },
                  { faixa: 'Acima de 40', label: 'Obesidade Grau III', color: 'bg-red-300 text-red-900' },
                ].map((row) => {
                  const isCurrent = resultado.classificacao.label === row.label;
                  return (
                    <tr key={row.label} className={`border-b border-gray-50 last:border-0 ${isCurrent ? 'bg-blue-50/50' : ''}`}>
                      <td className="py-3 px-4 text-gray-600">{row.faixa}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.color}`}>
                          {row.label}
                        </span>
                      </td>
                      {isCurrent && <td className="py-3 px-4 text-right text-blue-600 text-xs font-bold animate-pulse">← Você</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ResultCard>

          <p className="text-xs text-gray-400 text-center mt-4">
            O IMC é um indicador geral. Consulte um médico para avaliação completa.
          </p>
        </div>
      ) : (
        <EmptyState
          icon="⚖️"
          title="Pronto para calcular seu IMC"
          description="Informe seu peso e altura nos campos acima para ver sua classificação e dicas de saúde personalizadas."
        />
      )}

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que é IMC?</h2>
        <p>
          O Índice de Massa Corporal (IMC) é uma medida internacional usada para calcular se uma pessoa
          está no peso ideal. É calculado dividindo o peso (kg) pela altura ao quadrado (m²).
        </p>
        <h2>Limitações do IMC</h2>
        <p>
          O IMC não distingue massa muscular de gordura, nem considera a distribuição de gordura corporal.
          Atletas, por exemplo, podem ter IMC alto sem estar acima do peso. Por isso, é importante consultar
          um profissional de saúde para uma avaliação completa.
        </p>
      </article>
    </>
  );
}
