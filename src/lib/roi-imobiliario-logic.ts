/**
 * ROI Imobiliário Logic Module
 *
 * Módulo de lógica pura para cálculo de ROI e Cap Rate de investimentos imobiliários.
 * Contém APENAS funções puras sem efeitos colaterais.
 *
 * Princípios aplicados:
 * - Funções puras (mesmo input = mesmo output)
 * - Imutabilidade (não modifica dados de entrada)
 * - Zero dependências externas
 * - Tratamento de erros robusto (anti-NaN, anti-divisão por zero)
 */

// ============================================================
// TIPOS E INTERFACES
// ============================================================

export interface InputROI {
  readonly valorCompra: number;
  readonly custosIniciais: number;
  readonly valorAluguelMensal: number;
  readonly custosMensaisObra: number;
  readonly valorizacaoAnualPrevia: number;
}

export interface ResultadoROI {
  readonly investimentoTotal: number;
  readonly ganhoAluguelAnualBruto: number;
  readonly ganhoAluguelAnualLiquido: number;
  readonly valorizacaoPatrimonialAnual: number;
  readonly retornoAnualTotal: number;
  readonly capRatePercentual: number;
  readonly roiAnualPercentual: number;
}

// ============================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================

/**
 * Sanitiza um valor numérico de input do usuário.
 * Garante que nunca retorne NaN ou valores inválidos.
 *
 * @param value - Valor bruto do input
 * @param defaultValue - Valor padrão se inválido (default: 0)
 * @returns Número válido e finito, sempre >= 0
 */
export function sanitizeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const num = typeof value === 'string'
    ? parseFloat(value.replace(/[^\d.,-]/g, '').replace(',', '.'))
    : Number(value);

  if (!Number.isFinite(num) || Number.isNaN(num) || num < 0) {
    return defaultValue;
  }

  return num;
}

// ============================================================
// FUNÇÃO DE CÁLCULO (PURA)
// ============================================================

/**
 * Calcula o ROI e o Cap Rate de um investimento imobiliário.
 * Função pura — mesmo input sempre produz mesmo output.
 *
 * @param input - Dados de entrada do investimento
 * @returns Resultado completo com indicadores financeiros
 */
export function calcularROIImobiliario(input: InputROI): ResultadoROI {
  const compra = sanitizeNumber(input.valorCompra);
  const iniciais = sanitizeNumber(input.custosIniciais);
  const aluguel = sanitizeNumber(input.valorAluguelMensal);
  const custosMensais = sanitizeNumber(input.custosMensaisObra);
  const valorizacaoPercentual = sanitizeNumber(input.valorizacaoAnualPrevia);

  const investimentoTotal = compra + iniciais;

  const ganhoAluguelAnualBruto = aluguel * 12;
  const custosAnuais = custosMensais * 12;
  const ganhoAluguelAnualLiquido = Math.max(0, ganhoAluguelAnualBruto - custosAnuais);

  const valorizacaoPatrimonialAnual = compra * (valorizacaoPercentual / 100);

  const retornoAnualTotal = ganhoAluguelAnualLiquido + valorizacaoPatrimonialAnual;

  const divisor = investimentoTotal || 1;
  const capRatePercentual = (ganhoAluguelAnualLiquido / divisor) * 100;
  const roiAnualPercentual = (retornoAnualTotal / divisor) * 100;

  return {
    investimentoTotal,
    ganhoAluguelAnualBruto,
    ganhoAluguelAnualLiquido,
    valorizacaoPatrimonialAnual,
    retornoAnualTotal,
    capRatePercentual: Math.round(capRatePercentual * 100) / 100,
    roiAnualPercentual: Math.round(roiAnualPercentual * 100) / 100,
  };
}
