/**
 * Viagem Logic Module
 *
 * Módulo de lógica pura para cálculo de custo de viagem.
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

export type TipoTrajeto = 'ida' | 'ida-volta';

export interface InputViagem {
  readonly distancia: number;
  readonly consumo: number;
  readonly precoCombustivel: number;
  readonly pedagio: number;
  readonly tipoTrajeto: TipoTrajeto;
}

export interface ResultadoViagem {
  readonly distanciaTotal: number;
  readonly litrosNecessarios: number;
  readonly custoCombustivel: number;
  readonly custoPedagio: number;
  readonly custoTotal: number;
}

// ============================================================
// CONSTANTES
// ============================================================

/** Valor padrão para campos numéricos vazios ou inválidos */
const SAFE_ZERO = 0;

/** Multiplicador para ida e volta */
const MULTIPLICADOR_IDA_VOLTA = 2;

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

/**
 * Valida se o tipo de trajeto é um valor aceito.
 *
 * @param value - Valor bruto do input
 * @returns Tipo de trajeto sanitizado
 */
export function sanitizeTipoTrajeto(value: unknown): TipoTrajeto {
  return value === 'ida-volta' ? 'ida-volta' : 'ida';
}

// ============================================================
// FUNÇÕES DE CÁLCULO (PURAS)
// ============================================================

/**
 * Calcula a distância total considerando o tipo de trajeto.
 *
 * @param distancia - Distância em km (ida)
 * @param tipoTrajeto - 'ida' ou 'ida-volta'
 * @returns Distância total em km
 */
export function calcularDistanciaTotal(distancia: number, tipoTrajeto: TipoTrajeto): number {
  const multiplicador = tipoTrajeto === 'ida-volta' ? MULTIPLICADOR_IDA_VOLTA : 1;
  return distancia * multiplicador;
}

/**
 * Calcula a quantidade de litros necessários.
 *
 * @param distanciaTotal - Distância total em km
 * @param consumo - Consumo do veículo em km/l
 * @returns Litros necessários (0 se consumo for 0)
 */
export function calcularLitros(distanciaTotal: number, consumo: number): number {
  if (consumo <= 0) return 0;
  return distanciaTotal / consumo;
}

/**
 * Calcula o custo total de combustível.
 *
 * @param litros - Quantidade de litros
 * @param precoCombustivel - Preço por litro em R$
 * @returns Custo total de combustível
 */
export function calcularCustoCombustivel(litros: number, precoCombustivel: number): number {
  return litros * precoCombustivel;
}

/**
 * Calcula o custo total de pedágio considerando o tipo de trajeto.
 *
 * @param pedagio - Custo de pedágio (trecho simples)
 * @param tipoTrajeto - 'ida' ou 'ida-volta'
 * @returns Custo total de pedágio
 */
export function calcularCustoPedagio(pedagio: number, tipoTrajeto: TipoTrajeto): number {
  const multiplicador = tipoTrajeto === 'ida-volta' ? MULTIPLICADOR_IDA_VOLTA : 1;
  return pedagio * multiplicador;
}

// ============================================================
// FUNÇÃO COMPOSTA (ORQUESTRAÇÃO)
// ============================================================

/**
 * Calcula o resultado completo do custo de viagem.
 * Função pura que orquestra todos os cálculos.
 *
 * @param input - Dados de entrada da viagem
 * @returns Resultado completo dos cálculos
 */
export function calcularCustoViagem(input: InputViagem): ResultadoViagem {
  const distanciaTotal = calcularDistanciaTotal(input.distancia, input.tipoTrajeto);
  const litrosNecessarios = calcularLitros(distanciaTotal, input.consumo);
  const custoCombustivel = calcularCustoCombustivel(litrosNecessarios, input.precoCombustivel);
  const custoPedagio = calcularCustoPedagio(input.pedagio, input.tipoTrajeto);
  const custoTotal = custoCombustivel + custoPedagio;

  return {
    distanciaTotal,
    litrosNecessarios,
    custoCombustivel,
    custoPedagio,
    custoTotal,
  };
}
