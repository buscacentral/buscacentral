/**
 * Extenso Logic Module
 *
 * Converte números e valores monetários (em Reais) para a forma por extenso
 * em português do Brasil. Contém APENAS funções puras, sem efeitos colaterais.
 *
 * Regras aplicadas (PT-BR):
 * - "cem" para exatamente 100; "cento" para 101-199.
 * - "e" liga centena/dezena/unidade dentro de cada classe.
 * - Entre classes, usa-se vírgula; antes da última classe usa-se "e" quando o
 *   último grupo for menor que 100 ou múltiplo de 100.
 * - "mil" é invariável e "um mil" vira apenas "mil".
 * - Valores inteiros exatos em milhão/bilhão/trilhão usam "de reais"
 *   (ex.: "um milhão de reais").
 */

// ============================================================
// CONSTANTES
// ============================================================

const UNIDADES = [
  'zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
];

const DEZ_A_DEZENOVE = [
  'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete',
  'dezoito', 'dezenove',
];

const DEZENAS = [
  '', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta',
  'oitenta', 'noventa',
];

const CENTENAS = [
  '', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos',
  'seiscentos', 'setecentos', 'oitocentos', 'novecentos',
];

/** Escalas por classe: [singular, plural]. Índice 0 = sem escala, 1 = mil. */
const ESCALAS: readonly (readonly [string, string])[] = [
  ['', ''],
  ['mil', 'mil'],
  ['milhão', 'milhões'],
  ['bilhão', 'bilhões'],
  ['trilhão', 'trilhões'],
];

/** Maior valor inteiro suportado (até 999 trilhões). */
const MAX_SUPORTADO = 999_999_999_999_999;

// ============================================================
// FUNÇÕES AUXILIARES (PURAS)
// ============================================================

/**
 * Converte um grupo de 0 a 999 para extenso (sem escala).
 *
 * @param n - Número entre 0 e 999
 * @returns Texto por extenso (ex.: 123 → "cento e vinte e três")
 */
export function tripletoPorExtenso(n: number): string {
  if (n <= 0 || n > 999) return '';
  if (n === 100) return 'cem';

  const centena = Math.floor(n / 100);
  const resto = n % 100;
  const partes: string[] = [];

  if (centena > 0) partes.push(CENTENAS[centena]);

  if (resto > 0) {
    if (resto < 10) {
      partes.push(UNIDADES[resto]);
    } else if (resto < 20) {
      partes.push(DEZ_A_DEZENOVE[resto - 10]);
    } else {
      const dezena = Math.floor(resto / 10);
      const unidade = resto % 10;
      partes.push(unidade === 0 ? DEZENAS[dezena] : `${DEZENAS[dezena]} e ${UNIDADES[unidade]}`);
    }
  }

  return partes.join(' e ');
}

// ============================================================
// FUNÇÕES PRINCIPAIS (PURAS)
// ============================================================

/**
 * Converte um número inteiro para a forma por extenso.
 * Números negativos recebem o prefixo "menos". Decimais são truncados.
 *
 * @param numero - Número a converter
 * @returns Texto por extenso, ou string vazia se acima do limite suportado
 */
export function numeroPorExtenso(numero: number): string {
  if (!Number.isFinite(numero)) return '';

  const negativo = numero < 0;
  const inteiro = Math.floor(Math.abs(numero));

  if (inteiro === 0) return 'zero';
  if (inteiro > MAX_SUPORTADO) return '';

  // Quebra em grupos de 3 dígitos (grupos[0] = unidades, [1] = milhares, ...)
  const grupos: number[] = [];
  let restante = inteiro;
  while (restante > 0) {
    grupos.push(restante % 1000);
    restante = Math.floor(restante / 1000);
  }

  const partes: string[] = [];
  let valorUltimoGrupo = 0;

  for (let i = grupos.length - 1; i >= 0; i--) {
    const valor = grupos[i];
    if (valor === 0) continue;

    let texto = tripletoPorExtenso(valor);

    if (i === 1) {
      // Classe dos milhares: "mil" é invariável e "um mil" vira "mil".
      texto = valor === 1 ? 'mil' : `${texto} mil`;
    } else if (i >= 2) {
      const [singular, plural] = ESCALAS[i];
      texto = `${texto} ${valor === 1 ? singular : plural}`;
    }

    partes.push(texto);
    valorUltimoGrupo = valor;
  }

  if (partes.length === 1) {
    return negativo ? `menos ${partes[0]}` : partes[0];
  }

  // Conector antes da última classe: "e" se o último grupo < 100 ou múltiplo de 100.
  const conector = valorUltimoGrupo < 100 || valorUltimoGrupo % 100 === 0 ? ' e ' : ', ';
  const inicio = partes.slice(0, -1).join(', ');
  const resultado = `${inicio}${conector}${partes[partes.length - 1]}`;

  return negativo ? `menos ${resultado}` : resultado;
}

/**
 * Converte um valor monetário (em Reais) para a forma por extenso.
 *
 * @param valor - Valor em reais (ex.: 1234.56)
 * @returns Texto por extenso (ex.: "mil, duzentos e trinta e quatro reais e
 *          cinquenta e seis centavos")
 */
export function valorPorExtenso(valor: number): string {
  if (!Number.isFinite(valor)) return '';

  const negativo = valor < 0;
  const absoluto = Math.abs(valor);

  let reais = Math.floor(absoluto);
  let centavos = Math.round((absoluto - reais) * 100);

  // Trata arredondamento que estoura para 100 centavos.
  if (centavos === 100) {
    reais += 1;
    centavos = 0;
  }

  if (reais > MAX_SUPORTADO) return '';

  const partes: string[] = [];

  if (reais > 0) {
    const extensoReais = numeroPorExtenso(reais);
    const terminaEmEscala = /(milhão|milhões|bilhão|bilhões|trilhão|trilhões)$/.test(extensoReais);
    const moeda = reais === 1 ? 'real' : 'reais';
    const conector = terminaEmEscala ? 'de ' : '';
    partes.push(`${extensoReais} ${conector}${moeda}`);
  }

  if (centavos > 0) {
    const moeda = centavos === 1 ? 'centavo' : 'centavos';
    partes.push(`${numeroPorExtenso(centavos)} ${moeda}`);
  }

  if (partes.length === 0) {
    return 'zero reais';
  }

  const resultado = partes.join(' e ');
  return negativo ? `menos ${resultado}` : resultado;
}

/**
 * Capitaliza a primeira letra de um texto (para exibição).
 *
 * @param texto - Texto de entrada
 * @returns Texto com a primeira letra maiúscula
 */
export function capitalizar(texto: string): string {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
