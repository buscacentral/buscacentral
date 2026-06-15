'use client';

import { useState, useMemo } from 'react';
import { ResultCard } from '@/components/ui/ResultCard';
import { EmptyState } from '@/components/ui/EmptyState';

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

function isFeriado(date: Date, feriadosMap: Map<string, string>): string | null {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  return feriadosMap.get(key) || null;
}

function buildFeriadosMap(inicio: Date, fim: Date): Map<string, string> {
  const map = new Map<string, string>();
  for (let ano = inicio.getFullYear(); ano <= fim.getFullYear(); ano++) {
    for (const f of getTodosFeriados(ano)) {
      const key = `${f.data.getFullYear()}-${f.data.getMonth()}-${f.data.getDate()}`;
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

export default function DiasUteisClient() {
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Data Final</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={incluirFeriados}
                  onChange={(e) => setIncluirFeriados(e.target.checked)}
                  className="peer w-5 h-5 border-2 border-slate-300 rounded-md appearance-none checked:bg-sky-600 checked:border-sky-600 transition-colors cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Incluir feriados nacionais</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Atalhos (Hoje até...)</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '+30 dias', action: () => setAtalho(30) },
                { label: '+60 dias', action: () => setAtalho(60) },
                { label: '+90 dias', action: () => setAtalho(90) },
                { label: '+6 meses', action: () => setAtalhoMeses(6) },
                { label: '+1 ano', action: () => setAtalhoMeses(12) },
              ].map((atalho) => (
                <button
                  key={atalho.label}
                  onClick={atalho.action}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-sky-100 hover:text-sky-700 transition-colors"
                >
                  {atalho.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        {resultado ? (
          <ResultCard title="Resultado do Período">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-center hover:shadow-md transition-all">
                <p className="text-3xl font-black text-sky-700 mb-1">{resultado.diasCorridos}</p>
                <p className="text-xs font-medium text-sky-600 uppercase tracking-wide">Dias Corridos</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-md hover:shadow-emerald-100 transition-all">
                <p className="text-3xl font-black text-emerald-700 mb-1">{resultado.diasUteis}</p>
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Dias Úteis</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center hover:shadow-md transition-all">
                <p className="text-3xl font-black text-amber-700 mb-1">{resultado.finaisSemana}</p>
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">Finais Semana</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center hover:shadow-md transition-all">
                <p className="text-3xl font-black text-purple-700 mb-1">{resultado.qtdFeriados}</p>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Feriados</p>
              </div>
            </div>

            {resultado.listaFeriados.length > 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="text-purple-600">🎉</span> Feriados no período
                </h3>
                <ul className="space-y-2">
                  {resultado.listaFeriados.map((f, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm py-2 border-b border-slate-200/60 last:border-0 last:pb-0">
                      <span className="font-medium text-slate-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{f.data}</span>
                      <span className="text-slate-900 font-semibold">{f.nome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                <p className="text-sm text-slate-500 font-medium">Nenhum feriado encontrado no período selecionado.</p>
              </div>
            )}
          </ResultCard>
        ) : (
          <div className="h-full flex items-center justify-center min-h-[300px]">
            <EmptyState
              icon="📅"
              title="Calcule os Dias Úteis"
              description="Selecione as datas à esquerda para ver a contagem de dias úteis, corridos e feriados."
            />
          </div>
        )}
      </div>
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
    </>
  );
}
