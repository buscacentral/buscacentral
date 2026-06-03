'use client';

import { useState, useMemo } from 'react';

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateBR(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function calcularPascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}

function getFeriadosMoveis(ano: number): { data: Date; nome: string }[] {
  const pascoa = calcularPascoa(ano);
  const carnaval = new Date(pascoa);
  carnaval.setDate(carnaval.getDate() - 47);
  const sextaFeiraSanta = new Date(pascoa);
  sextaFeiraSanta.setDate(sextaFeiraSanta.getDate() - 2);
  const corpusChristi = new Date(pascoa);
  corpusChristi.setDate(corpusChristi.getDate() + 60);

  return [
    { data: carnaval, nome: 'Carnaval' },
    { data: sextaFeiraSanta, nome: 'Sexta-Feira Santa' },
    { data: corpusChristi, nome: 'Corpus Christi' },
  ];
}

function getFeriadosFixos(ano: number): { data: Date; nome: string }[] {
  return [
    { data: new Date(ano, 0, 1), nome: 'Confraternização Universal' },
    { data: new Date(ano, 3, 21), nome: 'Tiradentes' },
    { data: new Date(ano, 4, 1), nome: 'Dia do Trabalho' },
    { data: new Date(ano, 8, 7), nome: 'Independência do Brasil' },
    { data: new Date(ano, 9, 12), nome: 'Nossa Senhora Aparecida' },
    { data: new Date(ano, 10, 2), nome: 'Finados' },
    { data: new Date(ano, 10, 15), nome: 'Proclamação da República' },
    { data: new Date(ano, 11, 25), nome: 'Natal' },
  ];
}

function getTodosFeriados(ano: number): { data: Date; nome: string }[] {
  return [...getFeriadosFixos(ano), ...getFeriadosMoveis(ano)].sort((a, b) => a.data.getTime() - b.data.getTime());
}

function isFeriado(date: Date, feriados: Map<string, string>): string | null {
  const key = `${date.getMonth()}-${date.getDate()}`;
  return feriados.get(key) || null;
}

function buildFeriadosMap(inicio: Date, fim: Date): Map<string, string> {
  const map = new Map<string, string>();
  for (let ano = inicio.getFullYear(); ano <= fim.getFullYear(); ano++) {
    for (const f of getTodosFeriados(ano)) {
      const key = `${f.data.getMonth()}-${f.data.getDate()}`;
      map.set(key, f.nome);
    }
  }
  return map;
}

function calcularDias(inicio: Date, fim: Date, incluirFeriados: boolean) {
  const start = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const end = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate());

  const feriadosMap = incluirFeriados ? buildFeriadosMap(start, end) : new Map<string, string>();

  let diasCorridos = 0;
  let diasUteis = 0;
  let finaisSemana = 0;
  let qtdFeriados = 0;
  const listaFeriados: { data: string; nome: string }[] = [];

  const current = new Date(start);
  while (current <= end) {
    diasCorridos++;
    const diaSemana = current.getDay();
    const nomeFer = isFeriado(current, feriadosMap);

    if (diaSemana === 0 || diaSemana === 6) {
      finaisSemana++;
      if (nomeFer && incluirFeriados) {
        qtdFeriados++;
        listaFeriados.push({ data: formatDateBR(current), nome: nomeFer });
      }
    } else if (nomeFer && incluirFeriados) {
      qtdFeriados++;
      listaFeriados.push({ data: formatDateBR(current), nome: nomeFer });
    } else {
      diasUteis++;
    }

    current.setDate(current.getDate() + 1);
  }

  return { diasCorridos, diasUteis, finaisSemana, qtdFeriados, listaFeriados };
}

export default function DiasUteis() {
  const hoje = new Date();
  const [dataInicio, setDataInicio] = useState(formatDateISO(hoje));
  const [dataFim, setDataFim] = useState('');
  const [incluirFeriados, setIncluirFeriados] = useState(true);

  const resultado = useMemo(() => {
    if (!dataInicio || !dataFim) return null;
    const inicio = new Date(dataInicio + 'T00:00:00');
    const fim = new Date(dataFim + 'T00:00:00');
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime()) || fim < inicio) return null;
    return calcularDias(inicio, fim, incluirFeriados);
  }, [dataInicio, dataFim, incluirFeriados]);

  const setAtalho = (dias: number) => {
    const inicio = new Date();
    const fim = new Date();
    fim.setDate(fim.getDate() + dias);
    setDataInicio(formatDateISO(inicio));
    setDataFim(formatDateISO(fim));
  };

  const setAtalhoMeses = (meses: number) => {
    const inicio = new Date();
    const fim = new Date();
    fim.setMonth(fim.getMonth() + meses);
    setDataInicio(formatDateISO(inicio));
    setDataFim(formatDateISO(fim));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de Dias Úteis</h1>
      <p className="text-gray-600 mb-8">
        Calcule quantos dias úteis existem entre duas datas, descontando finais de semana e feriados nacionais brasileiros. Ideal para prazos contratuais, projetos e planejamento financeiro.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={incluirFeriados}
              onChange={(e) => setIncluirFeriados(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Incluir feriados nacionais</span>
          </label>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Atalhos &ldquo;Hoje até...&rdquo;</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '30 dias', action: () => setAtalho(30) },
              { label: '60 dias', action: () => setAtalho(60) },
              { label: '90 dias', action: () => setAtalho(90) },
              { label: '6 meses', action: () => setAtalhoMeses(6) },
              { label: '1 ano', action: () => setAtalhoMeses(12) },
            ].map((atalho) => (
              <button
                key={atalho.label}
                onClick={atalho.action}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {atalho.label}
              </button>
            ))}
          </div>
        </div>

        {resultado ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{resultado.diasCorridos}</p>
                <p className="text-xs text-blue-600 mt-1">Dias Corridos</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{resultado.diasUteis}</p>
                <p className="text-xs text-green-600 mt-1">Dias Úteis</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-orange-700">{resultado.finaisSemana}</p>
                <p className="text-xs text-orange-600 mt-1">Finais de Semana</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">{resultado.qtdFeriados}</p>
                <p className="text-xs text-purple-600 mt-1">Feriados</p>
              </div>
            </div>

            {resultado.listaFeriados.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Feriados no período</h3>
                <ul className="space-y-1">
                  {resultado.listaFeriados.map((f, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{f.data}</span>
                      <span className="text-gray-900 font-medium">{f.nome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Selecione as datas para ver o resultado.</p>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como calcular dias úteis?</h2>
        <p>
          Dias úteis são todos os dias que não são finais de semana (sábado e domingo) nem feriados
          nacionais. Esta calculadora considera os 8 feriados fixos brasileiros mais os feriados móveis
          (Carnaval, Sexta-Feira Santa e Corpus Christi), calculados pelo algoritmo da Páscoa.
        </p>
        <h2>Para que serve?</h2>
        <p>
          Calcular dias úteis é essencial para prazos contratuais, entregas de projetos, planejamento
          financeiro, cálculo de juros e multas, e qualquer situação que desconsidere finais de semana
          e feriados.
        </p>
      </article>
    </div>
  );
}
