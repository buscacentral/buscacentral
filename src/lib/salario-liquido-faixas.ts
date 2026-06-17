import { calcularINSS, calcularIRPF } from './trabalhista';

/**
 * Faixas de salário bruto mais buscadas (em reais inteiros). Usadas para:
 * - pré-renderizar as páginas no build (generateStaticParams)
 * - listar no sitemap (todas indexáveis)
 *
 * Valores fora desta lista ainda funcionam: a página é gerada sob demanda
 * (ISR) e fica em cache.
 */
export const SALARIOS_COMUNS: number[] = [
  1412, 1500, 1600, 1700, 1800, 1900,
  2000, 2100, 2200, 2300, 2400, 2500, 2600, 2800,
  3000, 3200, 3500, 3800,
  4000, 4200, 4500, 4800,
  5000, 5500, 6000, 6500, 7000, 7500,
  8000, 8500, 9000, 9500, 10000,
  11000, 12000, 13000, 14000, 15000,
  16000, 18000, 20000, 25000, 30000,
];

export interface SalarioLiquidoResult {
  bruto: number;
  inss: number;
  irpf: number;
  totalDescontos: number;
  liquido: number;
  percentualDescontos: number;
}

/**
 * Calcula o salário líquido no cenário-base (sem dependentes, pensão ou outros
 * descontos), reaproveitando exatamente a mesma lógica da calculadora interativa.
 */
export function calcularSalarioLiquido(bruto: number): SalarioLiquidoResult {
  const inss = calcularINSS(bruto);
  const irpf = calcularIRPF(bruto - inss);
  const totalDescontos = inss + irpf;
  const liquido = bruto - totalDescontos;
  const percentualDescontos = bruto > 0 ? (totalDescontos / bruto) * 100 : 0;
  return { bruto, inss, irpf, totalDescontos, liquido, percentualDescontos };
}

/** Valida se o valor é um salário bruto plausível (inteiro entre 1 e 1.000.000). */
export function isValidSalario(valor: number): boolean {
  return Number.isInteger(valor) && valor >= 1 && valor <= 1_000_000;
}

/** Slugs (valores) pré-renderizados no build. */
export function getSalarioParams(): { valor: string }[] {
  return SALARIOS_COMUNS.map((v) => ({ valor: String(v) }));
}

/** Faixas vizinhas (para links internos), excluindo o próprio valor. */
export function getSalariosVizinhos(valor: number, limit = 6): number[] {
  return [...SALARIOS_COMUNS]
    .filter((v) => v !== valor)
    .sort((a, b) => Math.abs(a - valor) - Math.abs(b - valor))
    .slice(0, limit)
    .sort((a, b) => a - b);
}

/** Formata um valor inteiro em reais sem centavos (ex.: 3000 -> "R$ 3.000"). */
export function formatarReaisInteiro(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}
