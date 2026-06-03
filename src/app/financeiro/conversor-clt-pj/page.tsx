'use client';

import { useState, useMemo } from 'react';

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const parseBRL = (v: string) => parseFloat(v.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

function calcularINSS(salario: number): number {
  const faixas = [
    { limite: 1518.00, aliquota: 0.075 },
    { limite: 2793.88, aliquota: 0.09 },
    { limite: 4190.83, aliquota: 0.12 },
    { limite: 8157.41, aliquota: 0.14 },
  ];

  if (salario <= 0) return 0;
  if (salario > 8157.41) return 8157.41 * 0.14;

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

export default function ConversorCLTPJ() {
  const [salarioBruto, setSalarioBruto] = useState('5000');
  const [mesesTrabalhados, setMesesTrabalhados] = useState('12');
  const [valeRefeicao, setValeRefeicao] = useState('1000');
  const [planoSaude, setPlanoSaude] = useState('500');
  const [gympass, setGympass] = useState('100');
  const [plrAnual, setPlrAnual] = useState('0');
  const [valorContador, setValorContador] = useState('100');

  const resultado = useMemo(() => {
    const bruto = parseBRL(salarioBruto);
    const mesesTrab = parseInt(mesesTrabalhados) || 12;
    const vr = parseBRL(valeRefeicao);
    const ps = parseBRL(planoSaude);
    const gym = parseBRL(gympass);
    const plr = parseBRL(plrAnual);
    const contador = parseBRL(valorContador);

    if (bruto <= 0) return null;

    // 13º e Férias proporcionais (ciclo anual correto)
    const mesesCiclo = mesesTrab % 12 || 12;
    const decimoTerceiro = (bruto / 12) * mesesCiclo / 12;
    const ferias = (bruto / 12) * mesesCiclo / 12;
    const umTercoFerias = ferias / 3;

    // FGTS acumulado (8% por mês)
    const fgtsAcumulado = bruto * mesesTrab * 0.08;

    // Multa FGTS 40% sobre saldo acumulado
    const multaFgts = fgtsAcumulado * 0.4;

    // INSS e IRRF sobre base tributável (salário bruto)
    const inss = calcularINSS(bruto);
    const baseIRRF = bruto - inss;
    const irrf = calcularIRRF(baseIRRF);

    // Líquido mensal CLT
    const liquidoMensal = bruto - inss - irrf;

    // PLR diluída em 12 meses
    const plrMensal = plr / 12;

    // Benefícios mensais
    const totalBeneficios = vr + ps + gym;

    // Ganho real CLT mensal (com PLR diluída)
    const ganhoRealCLT = liquidoMensal + totalBeneficios + plrMensal;

    // Provisão anual CLT (13º + férias + 1/3 férias + FGTS + multa)
    const provisaoAnualCLT = decimoTerceiro + ferias + umTercoFerias + fgtsAcumulado + multaFgts;
    const provisaoMensalCLT = provisaoAnualCLT / 12;

    // PJ - Faturamento necessário (Simples Nacional 6%)
    const faturamentoPJ = (ganhoRealCLT + contador) / (1 - 0.06);
    const impostoSimples = faturamentoPJ * 0.06;
    const liquidoPJ = faturamentoPJ - impostoSimples - contador;

    // Diferença
    const diferenca = liquidoPJ - ganhoRealCLT;
    const percentual = (diferenca / ganhoRealCLT) * 100;

    return {
      clt: {
        bruto,
        inss,
        irrf,
        liquidoMensal,
        valeRefeicao: vr,
        planoSaude: ps,
        gympass: gym,
        totalBeneficios,
        plrMensal,
        ganhoRealCLT,
        decimoTerceiro,
        ferias,
        umTercoFerias,
        fgtsAcumulado,
        multaFgts,
        provisaoAnualCLT,
        provisaoMensalCLT,
        mesesTrab,
        mesesCiclo,
      },
      pj: {
        faturamento: faturamentoPJ,
        impostoSimples,
        contador,
        liquido: liquidoPJ,
      },
      diferenca,
      percentual,
    };
  }, [salarioBruto, mesesTrabalhados, valeRefeicao, planoSaude, gympass, plrAnual, valorContador]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculadora CLT para PJ</h1>
      <p className="text-gray-600 mb-8">
        Converta seu salário CLT para PJ com precisão. Nossa calculadora considera INSS, IRRF, FGTS, 13º, férias, PLR e todos os benefícios para mostrar o faturamento real necessário.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORMULÁRIO */}
        <div className="space-y-6">
          {/* Dados de Contratação */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados de Contratação</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto CLT (R$)</label>
                <input
                  type="text"
                  value={salarioBruto}
                  onChange={(e) => setSalarioBruto(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meses Trabalhados no Ano</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={mesesTrabalhados}
                  onChange={(e) => setMesesTrabalhados(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12"
                />
                <p className="text-xs text-gray-400 mt-1">Usado para calcular 13º e férias proporcionais</p>
              </div>
            </div>
          </div>

          {/* Benefícios CLT */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Benefícios CLT (Opcionais)</h2>
            <p className="text-xs text-gray-400 mb-4">Preencha os benefícios que você recebe hoje</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vale Refeição/Alimentação (Mensal R$)</label>
                <input
                  type="text"
                  value={valeRefeicao}
                  onChange={(e) => setValeRefeicao(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Saúde/Odonto (Mensal R$)</label>
                <input
                  type="text"
                  value={planoSaude}
                  onChange={(e) => setPlanoSaude(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gympass/Outros (Mensal R$)</label>
                <input
                  type="text"
                  value={gympass}
                  onChange={(e) => setGympass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Bônus / PLR Anual (R$)</label>
                <input
                  type="text"
                  value={plrAnual}
                  onChange={(e) => setPlrAnual(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-400 mt-1">Será diluído em 12 meses no cálculo</p>
              </div>
            </div>
          </div>

          {/* Custos PJ */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Extras/Custos PJ</h2>
            <p className="text-xs text-gray-400 mb-4">Custos que você terá como Pessoa Jurídica</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo com Contabilidade (Mensal R$)</label>
                <input
                  type="text"
                  value={valorContador}
                  onChange={(e) => setValorContador(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="space-y-4">
          {resultado ? (
            <>
              {/* Breakdown CLT */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">CLT — Composição do Ganho Real</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Salário Bruto</dt>
                    <dd className="font-medium text-gray-900">{formatCurrency(resultado.clt.bruto)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-500">(-) INSS</dt>
                    <dd className="font-medium text-red-600">- {formatCurrency(resultado.clt.inss)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-500">(-) IRRF</dt>
                    <dd className="font-medium text-red-600">- {formatCurrency(resultado.clt.irrf)}</dd>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <dt className="font-semibold text-gray-900">= Salário Líquido</dt>
                    <dd className="font-bold text-gray-900">{formatCurrency(resultado.clt.liquidoMensal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-600">(+) Vale Refeição</dt>
                    <dd className="text-green-700">+ {formatCurrency(resultado.clt.valeRefeicao)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-600">(+) Plano de Saúde/Odonto</dt>
                    <dd className="text-green-700">+ {formatCurrency(resultado.clt.planoSaude)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-600">(+) Gympass/Outros</dt>
                    <dd className="text-green-700">+ {formatCurrency(resultado.clt.gympass)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-600">(+) PLR Diluída (÷12)</dt>
                    <dd className="text-green-700">+ {formatCurrency(resultado.clt.plrMensal)}</dd>
                  </div>
                  <div className="border-t-2 border-blue-200 pt-3 flex justify-between">
                    <dt className="font-bold text-blue-900 text-base">= Ganho Real Mensal CLT</dt>
                    <dd className="font-bold text-blue-700 text-lg">{formatCurrency(resultado.clt.ganhoRealCLT)}</dd>
                  </div>
                </dl>
              </div>

              {/* Provisão Anual CLT */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Provisão Anual CLT (que o PJ não tem)</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-blue-700">13º Proporcional ({resultado.clt.mesesCiclo} meses)</dt>
                    <dd className="text-blue-900">{formatCurrency(resultado.clt.decimoTerceiro)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-blue-700">Férias Proporcionais</dt>
                    <dd className="text-blue-900">{formatCurrency(resultado.clt.ferias)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-blue-700">1/3 de Férias</dt>
                    <dd className="text-blue-900">{formatCurrency(resultado.clt.umTercoFerias)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-blue-700">FGTS Acumulado (8% × {resultado.clt.mesesTrab}m)</dt>
                    <dd className="text-blue-900">{formatCurrency(resultado.clt.fgtsAcumulado)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-blue-700">Multa FGTS (40%)</dt>
                    <dd className="text-blue-900">{formatCurrency(resultado.clt.multaFgts)}</dd>
                  </div>
                  <div className="border-t border-blue-300 pt-2 flex justify-between">
                    <dt className="font-semibold text-blue-900">Total Provisão Anual</dt>
                    <dd className="font-bold text-blue-900">{formatCurrency(resultado.clt.provisaoAnualCLT)}</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-blue-600">Equivalente Mensal</dt>
                    <dd className="text-blue-700">+ {formatCurrency(resultado.clt.provisaoMensalCLT)}/mês</dd>
                  </div>
                </dl>
              </div>

              {/* Faturamento PJ Necessário */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">PJ — Faturamento Necessário</h2>
                <dl className="space-y-2 text-sm">
                  <div className="bg-green-50 rounded-lg p-4 text-center mb-4">
                    <p className="text-sm text-green-600 mb-1">Faturamento Mensal Necessário (Simples Nacional 6%)</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(resultado.pj.faturamento)}</p>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-500">(-) Imposto Simples Nacional (6%)</dt>
                    <dd className="font-medium text-red-600">- {formatCurrency(resultado.pj.impostoSimples)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-red-500">(-) Contabilidade</dt>
                    <dd className="font-medium text-red-600">- {formatCurrency(resultado.pj.contador)}</dd>
                  </div>
                  <div className="border-t-2 border-green-200 pt-3 flex justify-between">
                    <dt className="font-bold text-green-900 text-base">= Líquido PJ Mensal</dt>
                    <dd className="font-bold text-green-700 text-lg">{formatCurrency(resultado.pj.liquido)}</dd>
                  </div>
                </dl>
              </div>

              {/* Comparação Final */}
              <div className={`border-2 rounded-xl p-6 shadow-sm ${resultado.diferenca >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Comparação Final</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Ganho Real CLT</p>
                    <p className="text-xl font-bold text-blue-700">{formatCurrency(resultado.clt.ganhoRealCLT)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Líquido PJ</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(resultado.pj.liquido)}</p>
                  </div>
                </div>
                <div className="text-center border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-1">Diferença Mensal</p>
                  <p className={`text-3xl font-bold ${resultado.diferenca >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {resultado.diferenca >= 0 ? '+' : ''}{formatCurrency(resultado.diferenca)}
                  </p>
                  <p className={`text-sm mt-1 ${resultado.diferenca >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {resultado.diferenca >= 0 ? 'PJ é mais vantajoso' : 'CLT é mais vantajoso'} ({resultado.percentual >= 0 ? '+' : ''}{resultado.percentual.toFixed(1)}%)
                  </p>
                </div>
                <p className="text-xs text-gray-400 text-center mt-4">
                  * Não considera INSS pró-labore pois o sócio pode optar por não retirar pró-labore em alguns meses.
                </p>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Valores estimados para planejamento. Consulte um contador para decisões financeiras.
              </p>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-center py-8">Preencha o salário bruto para ver o comparativo detalhado.</p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Calculadora CLT para PJ: como converter seu salário com precisão</h2>
        <p>
          Nossa <strong>calculadora CLT para PJ</strong> foi desenvolvida para mostrar o faturamento real necessário ao migrar do regime celetista para Pessoa Jurídica. Diferente de simuladores comuns que apenas aplicam uma margem fixa, esta ferramenta calcula a <strong>base tributável</strong> corretamente — considerando que INSS e IRRF incidem apenas sobre o salário bruto, enquanto verbas indenizatórias como vale-refeição e plano de saúde são isentas.
        </p>

        <h3>Como o FGTS é projetado neste cálculo</h3>
        <p>
          O FGTS (Fundo de Garantia do Tempo de Serviço) representa 8% do salário bruto depositado mensalmente pela empresa. Ao converter para PJ, você perde esse depósito acumulado. Nossa calculadora projeta o saldo acumulado com base nos meses trabalhados e inclui a multa rescisória de 40% sobre o total — um valor que muitos simuladores ignoram, mas que faz diferença significativa no cálculo.
        </p>

        <h3>Por que considerar PLR e benefícios na conversão</h3>
        <p>
          A diluição de benefícios como PLR, Gympass e plano de saúde é essencial para um cálculo realista. Ao informar sua PLR anual, a calculadora divide por 12 e soma ao ganho mensal, mostrando o verdadeiro custo que a empresa tem com você como CLT. Assim, o faturamento PJ calculado reflete exatamente o que você precisa cobrar para manter o mesmo padrão de vida.
        </p>

        <h3>Entendendo a base tributável CLT</h3>
        <p>
          A base tributável é o valor sobre o qual incidem INSS e IRRF. No CLT, ela inclui salário bruto e aviso prévio, mas exclui benefícios como vale-transporte, vale-refeição e plano de saúde (quando não há opção em dinheiro). Esta distinção é crucial para calcular corretamente os descontos e comparar com o regime PJ.
        </p>
      </article>
    </div>
  );
}
