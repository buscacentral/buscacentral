/**
 * Formatters Module
 * 
 * Módulo de formatação usando APENAS a API Intl do navegador.
 * Zero dependências externas, performance máxima.
 * 
 * Princípios aplicados:
 * - Usa Intl (Internationalization API) nativa
 * - Funções puras e memoizáveis
 * - Tratamento de erros robusto
 * - Formatação consistente em todo o site
 */

// ============================================================
// INSTÂNCIAS REUTILIZÁVEIS (evita recriação a cada chamada)
// ============================================================

/** Formatador de moeda brasileira (R$) */
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formatador de número decimal brasileiro */
const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Formatador de número inteiro brasileiro */
const integerFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formatador de percentual brasileiro */
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Formatador de data brasileira */
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** Formatador de data e hora brasileira */
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Formatador de data por extenso */
const dateFormatterLong = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// ============================================================
// FUNÇÕES DE FORMATAÇÃO
// ============================================================

/**
 * Formata um número como moeda brasileira (R$).
 * 
 * @param value - Valor numérico
 * @returns String formatada (ex: "R$ 1.234,56")
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency(0) // "R$ 0,00"
 * formatCurrency(-50) // "-R$ 50,00"
 */
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return 'R$ 0,00';
  return currencyFormatter.format(value);
}

/**
 * Formata um número com 1 casa decimal.
 * 
 * @param value - Valor numérico
 * @returns String formatada (ex: "1.234,5")
 * @example
 * formatDecimal(1234.56) // "1.234,6"
 * formatDecimal(42.1) // "42,1"
 */
export function formatDecimal(value: number): string {
  if (!Number.isFinite(value)) return '0,0';
  return decimalFormatter.format(value);
}

/**
 * Formata um número inteiro com separador de milhar.
 * 
 * @param value - Valor numérico
 * @returns String formatada (ex: "1.234")
 * @example
 * formatInteger(1234) // "1.234"
 * formatInteger(42) // "42"
 */
export function formatInteger(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return integerFormatter.format(value);
}

/**
 * Formata um número como percentual.
 * 
 * @param value - Valor decimal (ex: 0.15 para 15%)
 * @returns String formatada (ex: "15,0%")
 * @example
 * formatPercent(0.15) // "15,0%"
 * formatPercent(1.5) // "150,0%"
 */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0,0%';
  return percentFormatter.format(value);
}

/**
 * Formata uma data no formato brasileiro (dd/mm/aaaa).
 * 
 * @param date - Data para formatar
 * @returns String formatada (ex: "25/12/2024")
 * @example
 * formatDate(new Date(2024, 11, 25)) // "25/12/2024"
 */
export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  return dateFormatter.format(date);
}

/**
 * Formata uma data e hora no formato brasileiro.
 * 
 * @param date - Data para formatar
 * @returns String formatada (ex: "25/12/2024 14:30")
 * @example
 * formatDateTime(new Date(2024, 11, 25, 14, 30)) // "25/12/2024 14:30"
 */
export function formatDateTime(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  return dateTimeFormatter.format(date);
}

/**
 * Formata uma data por extenso.
 * 
 * @param date - Data para formatar
 * @returns String formatada (ex: "quarta-feira, 25 de dezembro de 2024")
 * @example
 * formatDateLong(new Date(2024, 11, 25)) // "quarta-feira, 25 de dezembro de 2024"
 */
export function formatDateLong(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  return dateFormatterLong.format(date);
}

/**
 * Formata um CPF (xxx.xxx.xxx-xx).
 * 
 * @param cpf - String com 11 dígitos
 * @returns CPF formatado ou string vazia se inválido
 * @example
 * formatCPF('12345678901') // "123.456.789-01"
 */
export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um CNPJ (xx.xxx.xxx/xxxx-xx).
 * 
 * @param cnpj - String com 14 dígitos
 * @returns CNPJ formatado ou string vazia se inválido
 * @example
 * formatCNPJ('12345678000190') // "12.345.678/0001-90"
 */
export function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return cnpj;
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata um CEP (xxxxx-xxx).
 * 
 * @param cep - String com 8 dígitos
 * @returns CEP formatado ou string vazia se inválido
 * @example
 * formatCEP('01001000') // "01001-000"
 */
export function formatCEP(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return cep;
  return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata um telefone ((xx) xxxxx-xxxx ou (xx) xxxx-xxxx).
 * 
 * @param phone - String com 10 ou 11 dígitos
 * @returns Telefone formatado
 * @example
 * formatPhone('11987654321') // "(11) 98765-4321"
 * formatPhone('1134567890') // "(11) 3456-7890"
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

/**
 * Formata bytes em unidades legíveis.
 * 
 * @param bytes - Quantidade de bytes
 * @returns String formatada (ex: "1.5 MB")
 * @example
 * formatBytes(1536000) // "1.46 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  
  return `${value.toFixed(2)} ${units[i]}`;
}

/**
 * Formata duração em segundos para mm:ss ou hh:mm:ss.
 * 
 * @param seconds - Duração em segundos
 * @returns String formatada
 * @example
 * formatDuration(90) // "01:30"
 * formatDuration(3661) // "01:01:01"
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(m)}:${pad(s)}`;
}
