'use client';

import { useState, useMemo } from 'react';

const parseBRL = (v: string) => parseFloat(v.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type TipoRescisao = 'sem-justa-causa' | 'pedido-demissao' | 'justa-causa' | 'acordo-mutuo';
type TipoAviso = 'trabalhado' | 'indenizado';

function calcularINSS(salario: number): number {
  const faixas = [
    { limite: 1412.00, aliquota: 0.075 },
    { limite: 2666.68, aliquota: 0.09 },
    { limite: 4000.03, aliquota: 0.12 },
    { limite: 7786.02, aliquota: 0.14 },
  ];
  if (salario <= 0) return 0;
  if (salario > 7786.02) return 7786.02 * 0.14;
  let inss = 0, anterior = 0;
  for (const f of faixas) {
    if (salario <= f.limite) { inss += (salario - anterior) * f.aliquota; break; }
    inss += (f.limite - anterior) * f.aliquota; anterior = f.limite;
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
  for (const f of faixas) {
    if (base <= f.limite) { const ir = base * f.aliquota - f.deducao; return ir > 0 ? ir : 0; }
  }
  return 0;
}

function mesesEntre(d1: Date, d2: Date): number {
  let meses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  if (d2.getDate() > d1.getDate()) meses++;
  return Math.max(meses, 0);
}

function diasNoMes(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function calcularAvisoPrevio(mesesTrabalho: number): number {
  let dias = 30;
  if (mesesTrabalho > 12) dias += Math.floor((mesesTrabalho - 12) / 3) * 3;
  return Math.min(dias, 90);
}

interface Verba {
  nome: string;
  valor: number;
  descricao?: string;
}

interface Resultado {
  verbas: Verba[];
  totalBruto: number;
  descontos: number;
  totalLiquido: number;
  fgtsSaque: number;
  fgtsTotal: number;
  temSeguroDesemprego: boolean;
}

export default function RescisaoTrabalhista() {
  const [salario, setSalario] = useState('3000');
  const [dataAdmissao, setDataAdmissao] = useState('2022-01-01');
  const [dataDemissao, setDataDemissao] = useState('2025-06-01');
  const [tipo, setTipo] = useState<TipoRescisao>('sem-justa-causa');
  const [feriasVencidas, setFeriasVencidas] = useState('0');
  const [aviso, setAviso] = useState<TipoAviso>('indenizado');

  const resultado = useMemo((): Resultado | null => {
    const sal = parseBRL(salario);
    if (sal <= 0 || !dataAdmissao || !dataDemissao) return null;

    const admissao = new Date(dataAdmissao + 'T00:00:00');
    const demissao = new Date(dataDemissao + 'T00:00:00');
    if (isNaN(admissao.getTime()) || isNaN(demissao.getTime()) || demissao <= admissao) return null;

    const mesesTrab = mesesEntre(admissao, demissao);
    const diasTrab = demissao.getDate();
    const diasMes = diasNoMes(demissao);
    const mesesNoAno = demissao.getMonth() + 1;
    const mesesParaFerias = mesesTrab % 12 || 12;

    const saldoSalario = (sal / diasMes) * diasTrab;
    const avisoDias = calcularAvisoPrevio(mesesTrab);
    const avisoPrevio = (sal / 30) * avisoDias;
    const decimoTerceiro = (sal / 12) * mesesNoAno;
    const feriasProporcionais = (sal / 12) * mesesParaFerias;
    const umTercoFerias = feriasProporcionais / 3;
    const feriasVencValor = parseBRL(feriasVencidas) > 0 ? sal : 0;
    const umTercoFeriasVenc = feriasVencValor / 3;

    const fgtsTotal = sal * mesesTrab * 0.08;

    const verbas: Verba[] = [];
    let totalBruto = 0;
    let fgtsSaque = 0;
    let temSeguroDesemprego = false;

    if (tipo === 'sem-justa-causa') {
      const vals: Verba[] = [
        { nome: 'Saldo de Salário', valor: saldoSalario, descricao: `${diasTrab} dias` },
        { nome: 'Aviso Prévio Indenizado', valor: avisoPrevio, descricao: `${avisoDias} dias` },
        { nome: '13º Salário Proporcional', valor: decimoTerceiro, descricao: `${mesesNoAno}/12 avos` },
        { nome: 'Férias Proporcionais + 1/3', valor: feriasProporcionais + umTercoFerias, descricao: `${mesesParaFerias} meses` },
      ];
      if (feriasVencValor > 0) vals.push({ nome: 'Férias Vencidas + 1/3', valor: feriasVencValor + umTercoFeriasVenc });
      vals.push({ nome: 'Multa FGTS (40%)', valor: fgtsTotal * 0.4, descricao: 'sobre FGTS depositado' });
      vals.push({ nome: 'FGTS Depositado', valor: fgtsTotal, descricao: '8% × salários' });

      for (const v of vals) totalBruto += v.valor;
      fgtsSaque = fgtsTotal;
      temSeguroDesemprego = true;
      verbas.push(...vals);
    } else if (tipo === 'pedido-demissao') {
      const vals: Verba[] = [
        { nome: 'Saldo de Salário', valor: saldoSalario, descricao: `${diasTrab} dias` },
        { nome: '13º Salário Proporcional', valor: decimoTerceiro, descricao: `${mesesNoAno}/12 avos` },
        { nome: 'Férias Proporcionais + 1/3', valor: feriasProporcionais + umTercoFerias },
      ];
      if (feriasVencValor > 0) vals.push({ nome: 'Férias Vencidas + 1/3', valor: feriasVencValor + umTercoFeriasVenc });
      if (aviso === 'indenizado') {
        vals.push({ nome: 'Desconto Aviso Prévio', valor: -avisoPrevio, descricao: 'Não cumprido' });
      }
      vals.push({ nome: 'FGTS (sem multa)', valor: fgtsTotal, descricao: 'depositado' });

      for (const v of vals) totalBruto += v.valor;
      fgtsSaque = 0;
      temSeguroDesemprego = false;
      verbas.push(...vals);
    } else if (tipo === 'justa-causa') {
      const vals: Verba[] = [
        { nome: 'Saldo de Salário', valor: saldoSalario, descricao: `${diasTrab} dias` },
      ];
      if (feriasVencValor > 0) vals.push({ nome: 'Férias Vencidas + 1/3', valor: feriasVencValor + umTercoFeriasVenc });
      for (const v of vals) totalBruto += v.valor;
      fgtsSaque = 0;
      temSeguroDesemprego = false;
      verbas.push(...vals);
    } else {
      const vals: Verba[] = [
        { nome: 'Saldo de Salário', valor: saldoSalario, descricao: `${diasTrab} dias` },
        { nome: 'Aviso Prévio (50%)', valor: avisoPrevio * 0.5, descricao: `${avisoDias} dias × 50%` },
        { nome: '13º Salário Proporcional', valor: decimoTerceiro, descricao: `${mesesNoAno}/12 avos` },
        { nome: 'Férias Proporcionais + 1/3', valor: feriasProporcionais + umTercoFerias },
      ];
      if (feriasVencValor > 0) vals.push({ nome: 'Férias Vencidas + 1/3', valor: feriasVencValor + umTercoFeriasVenc });
      vals.push({ nome: 'Multa FGTS (20%)', valor: fgtsTotal * 0.2, descricao: 'sobre FGTS depositado' });
      for (const v of vals) totalBruto += v.valor;
      fgtsSaque = fgtsTotal * 0.8;
      temSeguroDesemprego = false;
      verbas.push(...vals);
    }

    const baseTributavel = saldoSalario + avisoPrevio;
    const inss = calcularINSS(baseTributavel);
    const irrf = calcularIRRF(baseTributavel - inss);
    const descontos = inss + irrf;

    return {
      verbas,
      totalBruto,
      descontos,
      totalLiquido: totalBruto - descontos,
      fgtsSaque,
      fgtsTotal,
      temSeguroDesemprego,
    };
  }, [salario, dataAdmissao, dataDemissao, tipo, feriasVencidas, aviso]);

  const tipos: { key: TipoRescisao; label: string }[] = [
    { key: 'sem-justa-causa', label: 'Sem Justa Causa' },
    { key: 'pedido-demissao', label: 'Pedido de Demissão' },
    { key: 'justa-causa', label: 'Justa Causa' },
    { key: 'acordo-mutuo', label: 'Acordo Mútuo' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de Rescisão Trabalhista</h1>
      <p className="text-gray-600 mb-8">
        Calcule os valores da sua rescisão trabalhista de forma rápida e gratuita.
        Nossa calculadora considera saldo de salário, aviso prévio, 13º salário
        proporcional, férias e multa do FGTS para todos os tipos de demissão.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados da Rescisão</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto (R$)</label>
              <input type="text" value={salario} onChange={(e) => setSalario(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão</label>
                <input type="date" value={dataAdmissao} onChange={(e) => setDataAdmissao(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Demissão</label>
                <input type="date" value={dataDemissao} onChange={(e) => setDataDemissao(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Rescisão</label>
              <div className="grid grid-cols-2 gap-2">
                {tipos.map((t) => (
                  <button key={t.key} onClick={() => setTipo(t.key)} className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${tipo === t.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Férias Vencidas (dias)</label>
              <input type="number" value={feriasVencidas} onChange={(e) => setFeriasVencidas(e.target.value)} min="0" max="30" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aviso Prévio</label>
              <div className="flex gap-2">
                {(['indenizado', 'trabalhado'] as const).map((a) => (
                  <button key={a} onClick={() => setAviso(a)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${aviso === a ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {a === 'indenizado' ? 'Indenizado' : 'Trabalhado'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {resultado ? (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Verbas Rescisórias</h2>
                <table className="w-full text-sm">
                  <tbody>
                    {resultado.verbas.map((v, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2.5 text-gray-700">
                          {v.nome}
                          {v.descricao && <span className="text-gray-400 text-xs ml-1">({v.descricao})</span>}
                        </td>
                        <td className={`py-2.5 text-right font-mono font-medium ${v.valor < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatCurrency(v.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Total Bruto</dt>
                    <dd className="font-bold text-gray-900 text-lg">{formatCurrency(resultado.totalBruto)}</dd>
                  </div>
                  {resultado.descontos > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-red-500">Descontos (INSS + IRRF)</dt>
                      <dd className="font-medium text-red-600">- {formatCurrency(resultado.descontos)}</dd>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <dt className="font-semibold text-gray-900">Total Líquido Estimado</dt>
                    <dd className="font-bold text-green-700 text-xl">{formatCurrency(resultado.totalLiquido)}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Informações Adicionais</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>FGTS total depositado: {formatCurrency(resultado.fgtsTotal)}</li>
                  {resultado.fgtsSaque > 0 && <li>FGTS disponível para saque: {formatCurrency(resultado.fgtsSaque)}</li>}
                  <li>Seguro-desemprego: {resultado.temSeguroDesemprego ? 'Sim ✅' : 'Não disponível'}</li>
                  {tipo === 'acordo-mutuo' && <li>Saque de 80% do FGTS permitido</li>}
                </ul>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Valores são estimativas. Consulte um advogado trabalhista ou contador para cálculos oficiais.
              </p>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-gray-500 text-center py-8">Preencha os dados para ver o resultado.</p>
            </div>
          )}
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Tipos de Rescisão</h2>
        <p>
          <strong>Sem justa causa:</strong> o empregador demite sem motivo. O trabalhador recebe todas as verbas,
          aviso prévio, multa de 40% do FGTS e tem direito ao seguro-desemprego.
        </p>
        <p>
          <strong>Pedido de demissão:</strong> o trabalhador pede para sair. Perde a multa do FGTS e o
          seguro-desemprego, e pode ter desconto do aviso prévio não cumprido.
        </p>
        <p>
          <strong>Justa causa:</strong> o empregador demite por falta grave. O trabalhador recebe apenas
          saldo de salário e férias vencidas.
        </p>
        <p>
          <strong>Acordo mútuo (art. 484-A):</strong> ambas as partes concordam. Multa FGTS de 20%,
          saque de 80% do FGTS, sem seguro-desemprego.
        </p>
      </article>
    </div>
  );
}
