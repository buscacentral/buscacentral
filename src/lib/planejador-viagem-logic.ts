/**
 * Planejador de Viagem Logic Module
 *
 * Módulo de lógica pura para planejamento e orçamento de viagens.
 * Contém APENAS funções puras sem efeitos colaterais.
 */

export interface InputViagem {
  readonly dataInicio: string;
  readonly dataFim: string;
  readonly custoPassagem: number;
  readonly diariasHotel: number;
  readonly diasHotel: number;
  readonly gastoAlimentacao: number;
  readonly gastoTransporte: number;
  readonly gastoAtividades: number;
  readonly outrosGastos: number;
  readonly numPessoas: number;
}

export interface ResultadoViagem {
  readonly diasTotais: number;
  readonly diasUteis: number;
  readonly diasParaViagem: number;
  readonly custoTotal: number;
  readonly custoPorPessoa: number;
  readonly custoPorDia: number;
  readonly custoPassagem: number;
  readonly custoHospedagem: number;
  readonly custoAlimentacao: number;
  readonly custoTransporte: number;
  readonly custoAtividades: number;
  readonly outrosGastos: number;
}

// ============================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================

export function sanitizeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') return defaultValue;
  const num = typeof value === 'string'
    ? parseFloat(value.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.'))
    : Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num) || num < 0) return defaultValue;
  return num;
}

// ============================================================
// FUNÇÕES DE CÁLCULO (PURAS)
// ============================================================

/**
 * Calcula a diferença em dias entre duas datas.
 */
export function calcularDias(dataInicio: string, dataFim: string): number {
  if (!dataInicio || !dataFim) return 0;
  const inicio = new Date(dataInicio + 'T00:00:00');
  const fim = new Date(dataFim + 'T00:00:00');
  if (isNaN(inicio.getTime()) || isNaN(fim.getTime()) || fim < inicio) return 0;
  const diff = fim.getTime() - inicio.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Calcula dias úteis entre duas datas (excluindo sábados e domingos).
 */
export function calcularDiasUteis(dataInicio: string, dataFim: string): number {
  if (!dataInicio || !dataFim) return 0;
  const inicio = new Date(dataInicio + 'T00:00:00');
  const fim = new Date(dataFim + 'T00:00:00');
  if (isNaN(inicio.getTime()) || isNaN(fim.getTime()) || fim < inicio) return 0;

  let uteis = 0;
  const current = new Date(inicio);
  while (current <= fim) {
    const dia = current.getDay();
    if (dia !== 0 && dia !== 6) uteis++;
    current.setDate(current.getDate() + 1);
  }
  return uteis;
}

/**
 * Calcula dias restantes até a viagem.
 */
export function calcularDiasParaViagem(dataInicio: string): number {
  if (!dataInicio) return 0;
  const inicio = new Date(dataInicio + 'T00:00:00');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (isNaN(inicio.getTime()) || inicio < hoje) return 0;
  const diff = inicio.getTime() - hoje.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ============================================================
// FUNÇÃO COMPOSTA (ORQUESTRAÇÃO)
// ============================================================

/**
 * Calcula o resultado completo do planejamento de viagem.
 */
export function calcularPlanejamento(input: InputViagem): ResultadoViagem {
  let diasTotais = calcularDias(input.dataInicio, input.dataFim);
  const diasHotelNum = sanitizeNumber(input.diasHotel);
  
  if (diasTotais === 0) {
    diasTotais = diasHotelNum > 0 ? diasHotelNum + 1 : 1;
  }

  const diasUteis = calcularDiasUteis(input.dataInicio, input.dataFim);
  const diasParaViagem = calcularDiasParaViagem(input.dataInicio);
  const pessoas = Math.max(1, sanitizeNumber(input.numPessoas, 1));

  const custoPassagem = sanitizeNumber(input.custoPassagem) * pessoas;
  const custoHospedagem = sanitizeNumber(input.diariasHotel) * diasHotelNum;
  const custoAlimentacao = sanitizeNumber(input.gastoAlimentacao) * diasTotais * pessoas;
  const custoTransporte = sanitizeNumber(input.gastoTransporte) * diasTotais;
  const custoAtividades = sanitizeNumber(input.gastoAtividades) * pessoas;
  const outrosGastos = sanitizeNumber(input.outrosGastos);

  const custoTotal = custoPassagem + custoHospedagem + custoAlimentacao + custoTransporte + custoAtividades + outrosGastos;
  const custoPorPessoa = pessoas > 0 ? custoTotal / pessoas : custoTotal;
  const custoPorDia = diasTotais > 0 ? custoTotal / diasTotais : 0;

  return {
    diasTotais,
    diasUteis,
    diasParaViagem,
    custoTotal,
    custoPorPessoa,
    custoPorDia,
    custoPassagem,
    custoHospedagem,
    custoAlimentacao,
    custoTransporte,
    custoAtividades,
    outrosGastos,
  };
}
