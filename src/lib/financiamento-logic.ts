/**
 * Financiamento Logic Module
 *
 * Módulo de lógica pura para simulação de financiamento imobiliário/veicular.
 * Contém APENAS funções puras sem efeitos colaterais.
 *
 * Sistemas de amortização implementados:
 * - Price (parcelas fixas)
 * - SAC (amortização constante, parcelas decrescentes)
 *
 * Princípios aplicados:
 * - Funções puras (mesmo input = mesmo output)
 * - Imutabilidade (não modifica dados de entrada)
 * - Zero dependências externas
 * - Tratamento de erros robusto
 * - Validação em cada camada
 */

// ============================================================
// TIPOS E INTERFACES
// ============================================================

export interface InputFinanciamento {
  readonly valorImovel: number;
  readonly valorEntrada: number;
  readonly prazoMeses: number;
  readonly taxaJurosAnual: number;
}

export interface Parcela {
  readonly numero: number;
  readonly parcela: number;
  readonly juros: number;
  readonly amortizacao: number;
  readonly saldoDevedor: number;
}

export interface ResumoSimulacao {
  readonly primeiraParcela: number;
  readonly ultimaParcela: number;
  readonly totalPago: number;
  readonly totalJuros: number;
}

export interface ResultadoFinanciamento {
  readonly valorFinanciado: number;
  readonly valorEntrada: number;
  readonly taxaMensal: number;
  readonly tabelaPrice: readonly Parcela[];
  readonly tabelaSAC: readonly Parcela[];
  readonly resumoPrice: ResumoSimulacao | null;
  readonly resumoSAC: ResumoSimulacao | null;
  readonly economia: number;
  readonly melhorSistema: 'price' | 'sac' | 'empate';
}

// ============================================================
// CONSTANTES
// ============================================================

/** Valor padrão para campos numéricos vazios ou inválidos */
const SAFE_ZERO = 0;

/** Meses no ano para conversão de taxa anual → mensal */
const MESES_NO_ANO = 12;

// ============================================================
// FUNÇÕES DE VALIDAÇÃO E SANITIZAÇÃO
// ============================================================

/**
 * Sanitiza um valor numérico de input do usuário.
 * Garante que nunca retorne NaN ou valores inválidos.
 *
 * @param value - Valor bruto do input (string ou number)
 * @param defaultValue - Valor padrão se inválido (default: 0)
 * @returns Número válido e finito, sempre >= 0
 */
export function sanitizeNumber(value: unknown, defaultValue: number = SAFE_ZERO): number {
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
// FUNÇÕES DE CÁLCULO (PURAS)
// ============================================================

/**
 * Converte taxa de juros anual para mensal.
 * Fórmula: (1 + anual)^(1/12) - 1
 *
 * @param taxaAnual - Taxa anual em percentual (ex: 12 para 12%)
 * @returns Taxa mensal em decimal (ex: 0.009489 para 12% a.a.)
 */
export function converterTaxaAnualParaMensal(taxaAnual: number): number {
  if (taxaAnual <= 0) return 0;
  const decimal = taxaAnual / 100;
  return Math.pow(1 + decimal, 1 / MESES_NO_ANO) - 1;
}

/**
 * Calcula o valor financiado (valor do imóvel - entrada).
 * Se a entrada for >= valor do imóvel, retorna 0.
 *
 * @param valorImovel - Valor total do imóvel/veículo
 * @param valorEntrada - Valor da entrada
 * @returns Valor financiado (sempre >= 0)
 */
export function calcularValorFinanciado(valorImovel: number, valorEntrada: number): number {
  const financiado = valorImovel - valorEntrada;
  return financiado > 0 ? financiado : 0;
}

/**
 * Calcula a tabela de amortização pelo sistema Price (parcelas fixas).
 *
 * No sistema Price:
 * - O valor da parcela é constante ao longo de todo o financiamento
 * - No início, paga-se mais juros e menos amortização
 * - No final, paga-se menos juros e mais amortização
 *
 * @param financiado - Valor financiado
 * @param taxaMensal - Taxa de juros mensal em decimal
 * @param parcelas - Número total de parcelas
 * @returns Array de parcelas com detalhamento
 */
export function calcularPrice(
  financiado: number,
  taxaMensal: number,
  parcelas: number
): readonly Parcela[] {
  if (financiado <= 0 || taxaMensal <= 0 || parcelas <= 0) return [];

  const i = taxaMensal;
  const pmt = financiado * (i * Math.pow(1 + i, parcelas)) / (Math.pow(1 + i, parcelas) - 1);
  const tabela: Parcela[] = [];
  let saldo = financiado;

  for (let n = 1; n <= parcelas; n++) {
    const juros = saldo * i;
    const amortizacao = pmt - juros;
    saldo -= amortizacao;

    tabela.push({
      numero: n,
      parcela: pmt,
      juros,
      amortizacao,
      saldoDevedor: Math.max(saldo, 0),
    });
  }

  return tabela;
}

/**
 * Calcula a tabela de amortização pelo SAC (amortização constante).
 *
 * No sistema SAC:
 * - A amortização é fixa (financiado / parcelas)
 * - Os juros diminuem a cada parcela (calculados sobre saldo devedor)
 * - As parcelas começam mais altas e vão diminuindo
 *
 * @param financiado - Valor financiado
 * @param taxaMensal - Taxa de juros mensal em decimal
 * @param parcelas - Número total de parcelas
 * @returns Array de parcelas com detalhamento
 */
export function calcularSAC(
  financiado: number,
  taxaMensal: number,
  parcelas: number
): readonly Parcela[] {
  if (financiado <= 0 || taxaMensal <= 0 || parcelas <= 0) return [];

  const amortizacaoConst = financiado / parcelas;
  const tabela: Parcela[] = [];
  let saldo = financiado;

  for (let n = 1; n <= parcelas; n++) {
    const juros = saldo * taxaMensal;
    const parcela = amortizacaoConst + juros;
    saldo -= amortizacaoConst;

    tabela.push({
      numero: n,
      parcela,
      juros,
      amortizacao: amortizacaoConst,
      saldoDevedor: Math.max(saldo, 0),
    });
  }

  return tabela;
}

/**
 * Gera o resumo de uma tabela de amortização.
 *
 * @param tabela - Array de parcelas
 * @returns Resumo com primeira/última parcela, total pago e total de juros
 */
export function gerarResumo(tabela: readonly Parcela[]): ResumoSimulacao | null {
  if (tabela.length === 0) return null;

  const totalPago = tabela.reduce((soma, p) => soma + p.parcela, 0);
  const totalJuros = tabela.reduce((soma, p) => soma + p.juros, 0);

  return {
    primeiraParcela: tabela[0].parcela,
    ultimaParcela: tabela[tabela.length - 1].parcela,
    totalPago,
    totalJuros,
  };
}

// ============================================================
// FUNÇÃO COMPOSTA (ORQUESTRAÇÃO)
// ============================================================

/**
 * Calcula o resultado completo da simulação de financiamento.
 * Função pura que orquestra todos os cálculos para ambos os sistemas.
 *
 * @param input - Dados de entrada do financiamento
 * @returns Resultado completo com tabelas Price e SAC
 */
export function calcularFinanciamento(input: InputFinanciamento): ResultadoFinanciamento {
  const valorFinanciado = calcularValorFinanciado(input.valorImovel, input.valorEntrada);
  const taxaMensal = converterTaxaAnualParaMensal(input.taxaJurosAnual);

  const tabelaPrice = calcularPrice(valorFinanciado, taxaMensal, input.prazoMeses);
  const tabelaSAC = calcularSAC(valorFinanciado, taxaMensal, input.prazoMeses);

  const resumoPrice = gerarResumo(tabelaPrice);
  const resumoSAC = gerarResumo(tabelaSAC);

  const totalPrice = resumoPrice?.totalPago ?? 0;
  const totalSAC = resumoSAC?.totalPago ?? 0;
  const economia = Math.abs(totalPrice - totalSAC);

  let melhorSistema: 'price' | 'sac' | 'empate' = 'empate';
  if (totalPrice < totalSAC) melhorSistema = 'price';
  else if (totalSAC < totalPrice) melhorSistema = 'sac';

  return {
    valorFinanciado,
    valorEntrada: input.valorEntrada,
    taxaMensal,
    tabelaPrice,
    tabelaSAC,
    resumoPrice,
    resumoSAC,
    economia,
    melhorSistema,
  };
}
