/**
 * Testes Unitários - Formatters
 * 
 * Testa todas as funções de formatação usando a API Intl do navegador.
 * Garante formatação consistente de moedas, datas, números e documentos.
 */

import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDecimal,
  formatInteger,
  formatPercent,
  formatDate,
  formatDateTime,
  formatDateLong,
  formatCPF,
  formatCNPJ,
  formatCEP,
  formatPhone,
  formatBytes,
  formatDuration,
} from '@/lib/formatters';

// ============================================================
// TESTES DE FORMATAÇÃO DE MOEDA
// ============================================================

describe('formatCurrency', () => {
  it('deve formatar valor positivo em Real brasileiro', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1.234,56');
    expect(result).toContain('R$');
  });

  it('deve formatar valor zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0,00');
    expect(result).toContain('R$');
  });

  it('deve formatar valores pequenos (centavos)', () => {
    const result = formatCurrency(0.5);
    expect(result).toContain('0,50');
  });

  it('deve formatar valores grandes com separador de milhar', () => {
    const result = formatCurrency(1234567.89);
    expect(result).toContain('1.234.567,89');
  });

  it('deve formatar valores negativos', () => {
    const result = formatCurrency(-500);
    expect(result).toContain('500,00');
    // Intl pode usar - ou () para negativos
    expect(result).toMatch(/[-R$]/);
  });

  it('deve formatar valor com arredondamento de centavos', () => {
    const result = formatCurrency(10.999);
    // Deve arredondar para 11,00
    expect(result).toContain('11,00');
  });

  it('deve formatar valor com muitas casas decimais', () => {
    const result = formatCurrency(10.123456789);
    // Deve truncar/arredondar para 2 casas
    expect(result).toContain('10,12');
  });

  it('deve retornar R$ 0,00 para valores não finitos', () => {
    expect(formatCurrency(Infinity)).toContain('0,00');
    expect(formatCurrency(-Infinity)).toContain('0,00');
    expect(formatCurrency(NaN)).toContain('0,00');
  });
});

// ============================================================
// TESTES DE FORMATAÇÃO DE NÚMEROS
// ============================================================

describe('formatDecimal', () => {
  it('deve formatar número com 1 casa decimal', () => {
    const result = formatDecimal(1234.5);
    expect(result).toContain('1.234,5');
  });

  it('deve arredondar para 1 casa decimal', () => {
    const result = formatDecimal(10.99);
    expect(result).toContain('11,0');
  });

  it('deve retornar 0,0 para valores não finitos', () => {
    expect(formatDecimal(NaN)).toContain('0');
    expect(formatDecimal(Infinity)).toContain('0');
  });
});

describe('formatInteger', () => {
  it('deve formatar número inteiro com separador de milhar', () => {
    const result = formatInteger(1234567);
    expect(result).toContain('1.234.567');
  });

  it('deve formatar zero', () => {
    const result = formatInteger(0);
    expect(result).toContain('0');
  });

  it('deve arredondar números decimais', () => {
    const result = formatInteger(1234.7);
    expect(result).toContain('1.235');
  });
});

describe('formatPercent', () => {
  it('deve formatar decimal como percentual', () => {
    const result = formatPercent(0.15);
    expect(result).toContain('15');
    expect(result).toContain('%');
  });

  it('deve formatar 100%', () => {
    const result = formatPercent(1);
    expect(result).toContain('100');
  });

  it('deve formatar 0%', () => {
    const result = formatPercent(0);
    expect(result).toContain('0');
  });
});

// ============================================================
// TESTES DE FORMATAÇÃO DE DATAS
// ============================================================

describe('formatDate', () => {
  it('deve formatar data no padrão brasileiro dd/mm/aaaa', () => {
    const date = new Date(2024, 11, 25); // 25/12/2024
    const result = formatDate(date);
    expect(result).toContain('25');
    expect(result).toContain('12');
    expect(result).toContain('2024');
  });

  it('deve retornar string vazia para data inválida', () => {
    const result = formatDate(new Date('invalid'));
    expect(result).toBe('');
  });
});

describe('formatDateTime', () => {
  it('deve formatar data e hora', () => {
    const date = new Date(2024, 11, 25, 14, 30);
    const result = formatDateTime(date);
    expect(result).toContain('25');
    expect(result).toContain('12');
    expect(result).toContain('2024');
  });
});

describe('formatDateLong', () => {
  it('deve formatar data por extenso', () => {
    const date = new Date(2024, 11, 25);
    const result = formatDateLong(date);
    expect(result).toContain('2024');
    expect(result.length).toBeGreaterThan(10);
  });
});

// ============================================================
// TESTES DE FORMATAÇÃO DE DOCUMENTOS
// ============================================================

describe('formatCPF', () => {
  it('deve formatar CPF corretamente', () => {
    const result = formatCPF('12345678901');
    expect(result).toBe('123.456.789-01');
  });

  it('deve retornar input original se não tiver 11 dígitos', () => {
    expect(formatCPF('123')).toBe('123');
    expect(formatCPF('123456789012')).toBe('123456789012');
  });

  it('deve remover caracteres não numéricos antes de formatar', () => {
    const result = formatCPF('123.456.789-01');
    expect(result).toBe('123.456.789-01');
  });
});

describe('formatCNPJ', () => {
  it('deve formatar CNPJ corretamente', () => {
    const result = formatCNPJ('12345678000190');
    expect(result).toBe('12.345.678/0001-90');
  });

  it('deve retornar input original se não tiver 14 dígitos', () => {
    expect(formatCNPJ('123')).toBe('123');
  });
});

describe('formatCEP', () => {
  it('deve formatar CEP corretamente', () => {
    const result = formatCEP('01001000');
    expect(result).toBe('01001-000');
  });

  it('deve retornar input original se não tiver 8 dígitos', () => {
    expect(formatCEP('123')).toBe('123');
  });
});

describe('formatPhone', () => {
  it('deve formatar celular com 11 dígitos', () => {
    const result = formatPhone('11987654321');
    expect(result).toBe('(11) 98765-4321');
  });

  it('deve formatar telefone fixo com 10 dígitos', () => {
    const result = formatPhone('1134567890');
    expect(result).toBe('(11) 3456-7890');
  });

  it('deve retornar input original se não tiver 10 ou 11 dígitos', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

// ============================================================
// TESTES DE FORMATAÇÃO DE BYTES
// ============================================================

describe('formatBytes', () => {
  it('deve formatar bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toContain('KB');
    expect(formatBytes(1048576)).toContain('MB');
    expect(formatBytes(1073741824)).toContain('GB');
  });

  it('deve formatar valores intermediários', () => {
    const result = formatBytes(1536000);
    expect(result).toContain('MB');
  });
});

// ============================================================
// TESTES DE FORMATAÇÃO DE DURAÇÃO
// ============================================================

describe('formatDuration', () => {
  it('deve formatar segundos em mm:ss', () => {
    expect(formatDuration(90)).toBe('01:30');
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(59)).toBe('00:59');
  });

  it('deve formatar horas em hh:mm:ss', () => {
    expect(formatDuration(3661)).toBe('01:01:01');
    expect(formatDuration(3600)).toBe('01:00:00');
  });

  it('deve retornar 00:00 para valores inválidos', () => {
    expect(formatDuration(-1)).toBe('00:00');
    expect(formatDuration(NaN)).toBe('00:00');
    expect(formatDuration(Infinity)).toBe('00:00');
  });
});
