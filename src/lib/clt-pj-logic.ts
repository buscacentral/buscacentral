/**
 * CLT-PJ Logic Module
 * 
 * Módulo de lógica pura para cálculos CLT → PJ.
 * Contém APENAS funções puras sem efeitos colaterais.
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

export interface InputCLT {
  readonly salarioBruto: number;
  readonly mesesTrabalhados: number;
  readonly valeRefeicao: number;
  readonly planoSaude: number;
  readonly planoOdontologico: number;
  readonly valeTransporte: number;
  readonly receberVT: boolean;
  readonly gympass: number;
  readonly outrosBeneficios: number;
  readonly plrAnual: number;
}

export interface InputPJ {
  readonly contador: number;
  readonly aliquotaSimples: number;
}

export interface ResultadoCLT {
  readonly bruto: number;
  readonly inss: number;
  readonly irrf: number;
  readonly liquidoMensal: number;
  readonly valeRefeicao: number;
  readonly planoSaude: number;
  readonly planoOdontologico: number;
  readonly valeTransporte: number;
  readonly gympass: number;
  readonly outrosBeneficios: number;
  readonly descontoVT: number;
  readonly totalBeneficios: number;
  readonly plrMensal: number;
  readonly ganhoRealCLT: number;
  readonly decimoTerceiro: number;
  readonly ferias: number;
  readonly umTercoFerias: number;
  readonly fgtsAcumulado: number;
  readonly multaFgts: number;
  readonly provisaoAnualCLT: number;
  readonly provisaoMensalCLT: number;
  readonly mesesTrab: number;
  readonly mesesCiclo: number;
}

export interface ResultadoPJ {
  readonly faturamento: number;
  readonly impostoSimples: number;
  readonly contador: number;
  readonly liquido: number;
}

export interface ResultadoComparacao {
  readonly clt: ResultadoCLT;
  readonly pj: ResultadoPJ;
  readonly diferenca: number;
  readonly percentual: number;
  readonly vantagem: 'CLT' | 'PJ';
}

// ============================================================
// CONSTANTES
// ============================================================

/** Faixas do INSS 2024 */
const FAIXAS_INSS = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 4190.83, aliquota: 0.12 },
  { limite: 8157.41, aliquota: 0.14 },
] as const;

/** Faixas do IRRF 2024 */
const FAIXAS_IRRF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
] as const;

/** Teto do INSS */
const TETO_INSS = 8157.41;

/** Percentual do FGTS */
const PERCENTUAL_FGTS = 0.08;

/** Multa rescisória do FGTS */
const MULTA_FGTS = 0.4;

// ============================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================

/**
 * Sanitiza um valor numérico de input do usuário.
 * Garante que nunca retorne NaN ou valores inválidos.
 * 
 * @param value - Valor bruto do input (string ou number)
 * @param defaultValue - Valor padrão se inválido (default: 0)
 * @returns Número válido e finito
 */
export function sanitizeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const num = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d.,-]/g, '').replace(',', '.'))
    : Number(value);

  if (!Number.isFinite(num) || Number.isNaN(num)) {
    return defaultValue;
  }

  return num;
}

/**
 * Valida se um input CLT é válido.
 * 
 * @param input - Dados do CLT para validar
 * @returns Objeto com isValid e mensagem de erro (se houver)
 */
export function validarInputCLT(input: InputCLT): { 
  readonly isValid: boolean; 
  readonly error?: string 
} {
  if (input.salarioBruto <= 0) {
    return { isValid: false, error: 'Salário bruto deve ser maior que zero' };
  }

  if (input.mesesTrabalhados < 1 || input.mesesTrabalhados > 12) {
    return { isValid: false, error: 'Meses trabalhados deve estar entre 1 e 12' };
  }

  return { isValid: true };
}

// ============================================================
// FUNÇÕES DE CÁLCULO (PURAS)
// ============================================================

/**
 * Calcula o INSS sobre o salário bruto.
 * Usa a tabela progressiva 2024.
 * 
 * @param salario - Salário bruto
 * @returns Valor do INSS descontado
 */
export function calcularINSS(salario: number): number {
  if (salario <= 0) return 0;
  if (salario > TETO_INSS) return TETO_INSS * 0.14;

  let inss = 0;
  let anterior = 0;

  for (const faixa of FAIXAS_INSS) {
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

/**
 * Calcula o IRRF sobre a base de cálculo.
 * Usa a tabela progressiva 2024 com deduções.
 * 
 * @param base - Base de cálculo (salário - INSS)
 * @returns Valor do IRRF descontado
 */
export function calcularIRRF(base: number): number {
  if (base <= 0) return 0;

  for (const faixa of FAIXAS_IRRF) {
    if (base <= faixa.limite) {
      const irrf = base * faixa.aliquota - faixa.deducao;
      return irrf > 0 ? irrf : 0;
    }
  }

  return 0;
}

/**
 * Calcula o 13º salário proporcional.
 * Usa o ciclo correto: mesesTrab % 12 || 12
 * 
 * @param bruto - Salário bruto
 * @param mesesTrab - Meses trabalhados no ano
 * @returns Valor proporcional do 13º
 */
export function calcularDecimoTerceiro(bruto: number, mesesTrab: number): number {
  const mesesCiclo = mesesTrab % 12 || 12;
  return (bruto / 12) * (mesesCiclo / 12);
}

/**
 * Calcula férias proporcionais com 1/3.
 * 
 * @param bruto - Salário bruto
 * @param mesesTrab - Meses trabalhados no ano
 * @returns Valor das férias proporcionais
 */
export function calcularFerias(bruto: number, mesesTrab: number): number {
  const mesesCiclo = mesesTrab % 12 || 12;
  return (bruto / 12) * (mesesCiclo / 12);
}

/**
 * Calcula o FGTS acumulado durante o período trabalhado.
 * 
 * @param bruto - Salário bruto
 * @param mesesTrab - Meses trabalhados
 * @returns Saldo acumulado do FGTS
 */
export function calcularFGTSAcumulado(bruto: number, mesesTrab: number): number {
  return bruto * mesesTrab * PERCENTUAL_FGTS;
}

/**
 * Calcula a multa rescisória do FGTS (40%).
 * 
 * @param fgtsAcumulado - Saldo acumulado do FGTS
 * @returns Valor da multa
 */
export function calcularMultaFGTS(fgtsAcumulado: number): number {
  return fgtsAcumulado * MULTA_FGTS;
}

/**
 * Percentual máximo de desconto do Vale Transporte (6% do salário base)
 */
const PERCENTUAL_VT = 0.06;

/**
 * Calcula o total de benefícios CLT.
 * Se receberVT for false, o VT é descontado do salário (não é benefício).
 * 
 * @returns Total de benefícios mensais e desconto VT
 */
export function calcularBeneficios(
  valeRefeicao: number,
  planoSaude: number,
  planoOdontologico: number,
  valeTransporte: number,
  receberVT: boolean,
  gympass: number,
  outrosBeneficios: number,
  salarioBruto: number,
): { totalBeneficios: number; descontoVT: number } {
  const descontoVT = receberVT ? 0 : Math.min(valeTransporte, salarioBruto * PERCENTUAL_VT);
  const vtComoBeneficio = receberVT ? valeTransporte : 0;
  const totalBeneficios = valeRefeicao + planoSaude + planoOdontologico + vtComoBeneficio + gympass + outrosBeneficios;
  return { totalBeneficios, descontoVT };
}

/**
 * Calcula a PLR diluída em 12 meses.
 * 
 * @param plrAnual - Valor anual da PLR
 * @returns Valor mensal da PLR
 */
export function calcularPLRMensal(plrAnual: number): number {
  return plrAnual / 12;
}

/**
 * Calcula o faturamento PJ necessário.
 * 
 * @param ganhoRealCLT - Ganho real mensal do CLT
 * @param contador - Custo mensal com contabilidade
 * @param aliquota - Alíquota do Simples Nacional (default: 6%)
 * @returns Faturamento bruto necessário
 */
export function calcularFaturamentoPJ(
  ganhoRealCLT: number,
  contador: number,
  aliquota: number = 0.06
): number {
  return (ganhoRealCLT + contador) / (1 - aliquota);
}

// ============================================================
// FUNÇÕES COMPOSTAS (ORQUESTRAÇÃO)
// ============================================================

/**
 * Calcula o resultado completo CLT.
 * Função pura que orquestra todos os cálculos CLT.
 * 
 * @param input - Dados de entrada do CLT
 * @returns Resultado completo dos cálculos CLT
 */
export function calcularResultadoCLT(input: InputCLT): ResultadoCLT {
  const {
    salarioBruto, mesesTrabalhados, valeRefeicao, planoSaude,
    planoOdontologico, valeTransporte, receberVT, gympass,
    outrosBeneficios, plrAnual,
  } = input;
  
  // Cálculos de descontos
  const inss = calcularINSS(salarioBruto);
  const baseIRRF = salarioBruto - inss;
  const irrf = calcularIRRF(baseIRRF);

  // Benefícios e desconto VT
  const { totalBeneficios, descontoVT } = calcularBeneficios(
    valeRefeicao, planoSaude, planoOdontologico, valeTransporte,
    receberVT, gympass, outrosBeneficios, salarioBruto,
  );

  const liquidoMensal = salarioBruto - inss - irrf - descontoVT;
  const plrMensal = calcularPLRMensal(plrAnual);

  // Ganho real
  const ganhoRealCLT = liquidoMensal + totalBeneficios + plrMensal;

  // Provisões anuais
  const mesesCiclo = mesesTrabalhados % 12 || 12;
  const decimoTerceiro = calcularDecimoTerceiro(salarioBruto, mesesTrabalhados);
  const ferias = calcularFerias(salarioBruto, mesesTrabalhados);
  const umTercoFerias = ferias / 3;
  const fgtsAcumulado = calcularFGTSAcumulado(salarioBruto, mesesTrabalhados);
  const multaFgts = calcularMultaFGTS(fgtsAcumulado);

  const provisaoAnualCLT = decimoTerceiro + ferias + umTercoFerias + fgtsAcumulado + multaFgts;
  const provisaoMensalCLT = provisaoAnualCLT / 12;

  return {
    bruto: salarioBruto,
    inss,
    irrf,
    liquidoMensal,
    valeRefeicao,
    planoSaude,
    planoOdontologico,
    valeTransporte,
    gympass,
    outrosBeneficios,
    descontoVT,
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
    mesesTrab: mesesTrabalhados,
    mesesCiclo,
  };
}

/**
 * Calcula o resultado completo PJ.
 * 
 * @param ganhoRealCLT - Ganho real mensal do CLT
 * @param inputPJ - Dados de entrada do PJ
 * @returns Resultado completo dos cálculos PJ
 */
export function calcularResultadoPJ(
  ganhoRealCLT: number,
  inputPJ: InputPJ
): ResultadoPJ {
  const { contador, aliquotaSimples } = inputPJ;

  const faturamento = calcularFaturamentoPJ(ganhoRealCLT, contador, aliquotaSimples);
  const impostoSimples = faturamento * aliquotaSimples;
  const liquido = faturamento - impostoSimples - contador;

  return {
    faturamento,
    impostoSimples,
    contador,
    liquido,
  };
}

/**
 * Calcula a comparação completa CLT vs PJ.
 * Função principal que orquestra todo o cálculo.
 * 
 * @param inputCLT - Dados do CLT
 * @param inputPJ - Dados do PJ
 * @returns Resultado comparativo completo
 */
export function calcularComparacaoCLTPJ(
  inputCLT: InputCLT,
  inputPJ: InputPJ
): ResultadoComparacao {
  const clt = calcularResultadoCLT(inputCLT);
  const pj = calcularResultadoPJ(clt.ganhoRealCLT, inputPJ);

  const diferenca = pj.liquido - clt.ganhoRealCLT;
  const percentual = (diferenca / clt.ganhoRealCLT) * 100;
  const vantagem = diferenca >= 0 ? 'PJ' : 'CLT';

  return {
    clt,
    pj,
    diferenca,
    percentual,
    vantagem,
  };
}
