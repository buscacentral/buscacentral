'use client';

import { useState, useMemo } from 'react';

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const parseBRL = (v: string) => parseFloat(v.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

function calcularINSS(salario: number): number {
  const faixas = [
    { limite: 1412.00, aliquota: 0.075 },
    { limite: 2666.68, aliquota: 0.09 },
    { limite: 4000.03, aliquota: 0.12 },
    { limite: 7786.02, aliquota: 0.14 },
  ];

  if (salario <= 0) return 0;
  if (salario > 7786.02) return 7786.02 * 0.14;

  let inss = 0;
  let anterior = 0;

  for (const faixa of faixas) {
    if (salario <= faixa.limite) {
      inss += (salario - anterior) * faixa.aliquota;
      break;
    } else {
      inss += (faixa.limite - anterior) * faixa.aliquota;
      anterior = faixa.limite;
    }
  }

  return inss;
}

function calcularIRRF(base: number): number {
  const faixas = [
    { limite: 2259.20, aliquota: 0, deducao: 0 },
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
  ];

  if (base <= 0) return 0;

  for (const faixa of faixas) {
    if (base <= faixa.limite) {
      const irrf = base * faixa.aliquota - faixa.deducao;
      return irrf > 0 ? irrf : 0;
    }
  }

  return 0;
}

interface ResultadoCLT {
  bruto: number;
  inss: number;
  irrf: number;
  liquido: number;
  valeRefeicao: number;
  valeTransporte: number;
  planoSaude: number;
  totalBeneficios: number;
  liquidoTotal: number;
}

interface ResultadoPJ {
  faturamento: number;
  impostoSimples: number;
  impostoLucroPresumido: number;
  proLabore: number;
  inssProLabore: number;
  contador: number;
  decimoTerceiro: number;
  ferias: number;
  custoSimples: number;
  custoLucroPresumido: number;
  liquidoSimples: number;
  liquidoLucroPresumido: number;
}

export default function ConversorCLTPJ() {
  const [salarioBruto, setSalarioBruto] = useState('5000');
  const [valeRefeicao, setValeRefeicao] = useState('1000');
  const [valeTransporte, setValeTransporte] = useState('300');
  const [planoSaude, setPlanoSaude] = useState('500');
  const [valorContador, setValorContador] = useState('150');

  const resultado = useMemo(() => {
    const bruto = parseBRL(salarioBruto);
    const vr = parseBRL(valeRefeicao);
    const vt = parseBRL(valeTransporte);
    const ps = parseBRL(planoSaude);
    const contador = parseBRL(valorContador);

    if (bruto <= 0) return null;

    const inss = calcularINSS(bruto);
    const baseIRRF = bruto - inss;
    const irrf = calcularIRRF(baseIRRF);
    const liquido = bruto - inss - irrf;
    const liquidoTotal = liquido + vr + vt + ps;

    const clt: ResultadoCLT = {
      bruto,
      inss,
      irrf,
      liquido,
      valeRefeicao: vr,
      valeTransporte: vt,
      planoSaude: ps,
      totalBeneficios: vr + vt + ps,
      liquidoTotal,
    };

    const proLabore = 1518.00;
    const inssProLabore = proLabore * 0.11;

    const decimoTerceiro = bruto / 12;
    const ferias = bruto / 12;
    const custoBeneficios = vr + vt + ps;

    const faturamentoSimples = (liquidoTotal + contador + inssProLabore + decimoTerceiro + ferias) / (1 - 0.06);
    const impostoSimples = faturamentoSimples * 0.06;
    const custoSimples = impostoSimples + contador + inssProLabore + decimoTerceiro + ferias;
    const liquidoSimples = faturamentoSimples - custoSimples;

    const faturamentoLucro = (liquidoTotal + contador + inssProLabore + decimoTerceiro + ferias) / (1 - 0.1333);
    const impostoLucro = faturamentoLucro * 0.1333;
    const custoLucro = impostoLucro + contador + inssProLabore + decimoTerceiro + ferias;
    const liquidoLucro = faturamentoLucro - custoLucro;

    const pj: ResultadoPJ = {
      faturamento: Math.max(faturamentoSimples, faturamentoLucro),
      impostoSimples,
      impostoLucroPresumido: impostoLucro,
      proLabore,
      inssProLabore,
      contador,
      decimoTerceiro,
      ferias,
      custoSimples,
      custoLucroPresumido: custoLucro,
      liquidoSimples,
      liquidoLucroPresumido: liquidoLucro,
    };

    const melhorRegime = liquidoSimples >= liquidoLucro ? 'simples' : 'lucro';
    const diferencaSimples = liquidoSimples - liquidoTotal;
    const diferencaLucro = liquidoLucro - liquidoTotal;
    const diferencaMelhor = melhorRegime === 'simples' ? diferencaSimples : diferencaLucro;
    const percentualMelhor = (diferencaMelhor / liquidoTotal) * 100;

    return { clt, pj, melhorRegime, diferencaSimples, diferencaLucro, diferencaMelhor, percentualMelhor };
  }, [salarioBruto, valeRefeicao, valeTransporte, planoSaude, valorContador]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversor CLT para PJ</h1>
      <p className="text-gray-600 mb-8">
        Descubra quanto você precisa faturar como PJ para ter o mesmo salário líquido que recebe na CLT.
        Nossa calculadora considera INSS, IRRF, impostos PJ, contador, férias e 13º salário.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados CLT</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto (R$)</label>
              <input
                type="text"
                value={salarioBruto}
                onChange={(e) => setSalarioBruto(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vale Refeição/Alimentação (R$)</label>
              <input
                type="text"
                value={valeRefeicao}
                onChange={(e) => setValeRefeicao(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vale Transporte (R$)</label>
              <input
                type="text"
                value={valeTransporte}
                onChange={(e) => setValeTransporte(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Saúde (R$)</label>
              <input
                type="text"
                value={planoSaude}
                onChange={(e) => setPlanoSaude(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contador Mensal (R$)</label>
              <input
                type="text"
                value={valorContador}
                onChange={(e) => setValorContador(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {resultado ? (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">CLT — Descontos</h2>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Salário Bruto</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(resultado.clt.bruto)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-500">INSS</dt>
                    <dd className="font-medium text-red-600">- {formatCurrency(resultado.clt.inss)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-500">IRRF</dt>
                    <dd className="font-medium text-red-600">- {formatCurrency(resultado.clt.irrf)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <dt className="font-semibold text-gray-900">Salário Líquido</dt>
                    <dd className="font-bold text-green-700">{formatCurrency(resultado.clt.liquido)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">+ Benefícios (VR+VT+Saúde)</dt>
                    <dd className="text-gray-700">{formatCurrency(resultado.clt.totalBeneficios)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <dt className="font-semibold text-gray-900">Líquido Total CLT</dt>
                    <dd className="font-bold text-green-700 text-lg">{formatCurrency(resultado.clt.liquidoTotal)}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">PJ — Faturamento Necessário</h2>
                <dl className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4 text-center mb-4">
                    <p className="text-sm text-blue-600 mb-1">Faturamento Mensal Necessário</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {formatCurrency(resultado.melhorRegime === 'simples' ? resultado.pj.faturamento : resultado.pj.faturamento)}
                    </p>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">Simples Nacional</h3>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Imposto (~6%)</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.impostoSimples)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Contador</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.contador)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">INSS Pró-labore</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.inssProLabore)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">13º + Férias (÷12)</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.decimoTerceiro + resultado.pj.ferias)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <dt className="font-semibold text-gray-900">Líquido Simples</dt>
                    <dd className={`font-bold ${resultado.diferencaSimples >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatCurrency(resultado.pj.liquidoSimples)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">vs CLT</dt>
                    <dd className={`font-medium ${resultado.diferencaSimples >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {resultado.diferencaSimples >= 0 ? '+' : ''}{formatCurrency(resultado.diferencaSimples)}
                    </dd>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">Lucro Presumido</h3>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Imposto (~13,33%)</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.impostoLucroPresumido)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">Contador</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.contador)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">INSS Pró-labore</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.inssProLabore)}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">13º + Férias (÷12)</dt>
                    <dd className="text-red-600">- {formatCurrency(resultado.pj.decimoTerceiro + resultado.pj.ferias)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <dt className="font-semibold text-gray-900">Líquido Lucro Presumido</dt>
                    <dd className={`font-bold ${resultado.diferencaLucro >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatCurrency(resultado.pj.liquidoLucroPresumido)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-500">vs CLT</dt>
                    <dd className={`font-medium ${resultado.diferencaLucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {resultado.diferencaLucro >= 0 ? '+' : ''}{formatCurrency(resultado.diferencaLucro)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className={`border rounded-xl p-5 shadow-sm ${resultado.melhorRegime === 'simples' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Recomendação</h2>
                <p className="text-gray-700">
                  O regime <strong>{resultado.melhorRegime === 'simples' ? 'Simples Nacional' : 'Lucro Presumido'}</strong> é
                  mais vantajoso, oferecendo{' '}
                  <strong className={resultado.diferencaMelhor >= 0 ? 'text-green-700' : 'text-red-700'}>
                    {resultado.diferencaMelhor >= 0 ? '+' : ''}{formatCurrency(resultado.diferencaMelhor)}
                  </strong>{' '}
                  ({resultado.percentualMelhor >= 0 ? '+' : ''}{resultado.percentualMelhor.toFixed(1)}%) por mês em relação à CLT.
                </p>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Os valores são estimativas para fins de planejamento. Consulte um contador para decisões financeiras.
              </p>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-center py-8">Preencha os dados CLT para ver o resultado.</p>
            </div>
          )}
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>CLT vs PJ: o que muda?</h2>
        <p>
          Na CLT, o empregador recolhe INSS e IRRF automaticamente, além de oferecer benefícios
          como vale-transporte, vale-refeição e plano de saúde. Como PJ, o profissional é responsável
          por seus próprios impostos e não recebe benefícios trabalhistas.
        </p>
        <h2>Por que usar esta calculadora?</h2>
        <p>
          Muitos profissionais recebem propostas para migrar de CLT para PJ sem saber exatamente
          quanto devem cobrar. Esta ferramenta mostra o faturamento necessário para manter o mesmo
          poder de compra, considerando todos os custos envolvidos.
        </p>
      </article>
    </div>
  );
}
