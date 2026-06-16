/**
 * Testes Unitários - Extenso Logic
 *
 * Cobre a conversão de números e valores monetários para a forma por extenso
 * em português do Brasil, incluindo as regras de "cem/cento", "mil", o conector
 * "e" entre classes e o "de reais" para valores exatos em milhão/bilhão.
 */

import { describe, it, expect } from 'vitest';
import {
  tripletoPorExtenso,
  numeroPorExtenso,
  valorPorExtenso,
  capitalizar,
} from '../src/lib/extenso-logic';

describe('tripletoPorExtenso', () => {
  it('converte unidades', () => {
    expect(tripletoPorExtenso(1)).toBe('um');
    expect(tripletoPorExtenso(9)).toBe('nove');
  });

  it('converte dezenas especiais (10-19)', () => {
    expect(tripletoPorExtenso(10)).toBe('dez');
    expect(tripletoPorExtenso(15)).toBe('quinze');
    expect(tripletoPorExtenso(19)).toBe('dezenove');
  });

  it('converte dezenas com unidades usando "e"', () => {
    expect(tripletoPorExtenso(21)).toBe('vinte e um');
    expect(tripletoPorExtenso(99)).toBe('noventa e nove');
    expect(tripletoPorExtenso(30)).toBe('trinta');
  });

  it('diferencia "cem" de "cento"', () => {
    expect(tripletoPorExtenso(100)).toBe('cem');
    expect(tripletoPorExtenso(101)).toBe('cento e um');
    expect(tripletoPorExtenso(199)).toBe('cento e noventa e nove');
  });

  it('converte centenas exatas e compostas', () => {
    expect(tripletoPorExtenso(200)).toBe('duzentos');
    expect(tripletoPorExtenso(205)).toBe('duzentos e cinco');
    expect(tripletoPorExtenso(123)).toBe('cento e vinte e três');
    expect(tripletoPorExtenso(999)).toBe('novecentos e noventa e nove');
  });

  it('retorna vazio para fora do intervalo', () => {
    expect(tripletoPorExtenso(0)).toBe('');
    expect(tripletoPorExtenso(1000)).toBe('');
  });
});

describe('numeroPorExtenso', () => {
  it('converte zero', () => {
    expect(numeroPorExtenso(0)).toBe('zero');
  });

  it('trunca decimais', () => {
    expect(numeroPorExtenso(7.9)).toBe('sete');
  });

  it('usa "mil" invariável (sem "um mil")', () => {
    expect(numeroPorExtenso(1000)).toBe('mil');
    expect(numeroPorExtenso(2000)).toBe('dois mil');
    expect(numeroPorExtenso(100000)).toBe('cem mil');
  });

  it('aplica "e" antes do último grupo quando < 100', () => {
    expect(numeroPorExtenso(1001)).toBe('mil e um');
    expect(numeroPorExtenso(2015)).toBe('dois mil e quinze');
  });

  it('aplica "e" antes do último grupo quando múltiplo de 100', () => {
    expect(numeroPorExtenso(1100)).toBe('mil e cem');
    expect(numeroPorExtenso(1200)).toBe('mil e duzentos');
    expect(numeroPorExtenso(1500000)).toBe('um milhão e quinhentos mil');
  });

  it('usa vírgula quando o último grupo não é < 100 nem múltiplo de 100', () => {
    expect(numeroPorExtenso(1234)).toBe('mil, duzentos e trinta e quatro');
    expect(numeroPorExtenso(1000150)).toBe('um milhão, cento e cinquenta');
  });

  it('converte milhões no singular e plural', () => {
    expect(numeroPorExtenso(1000000)).toBe('um milhão');
    expect(numeroPorExtenso(2000000)).toBe('dois milhões');
  });

  it('converte um número grande com várias classes', () => {
    expect(numeroPorExtenso(1234567)).toBe(
      'um milhão, duzentos e trinta e quatro mil, quinhentos e sessenta e sete',
    );
  });

  it('converte bilhões', () => {
    expect(numeroPorExtenso(1000000000)).toBe('um bilhão');
    expect(numeroPorExtenso(2000000000)).toBe('dois bilhões');
  });

  it('aplica o prefixo "menos" para negativos', () => {
    expect(numeroPorExtenso(-42)).toBe('menos quarenta e dois');
  });

  it('retorna vazio acima do limite suportado', () => {
    expect(numeroPorExtenso(1_000_000_000_000_000)).toBe('');
  });
});

describe('valorPorExtenso', () => {
  it('converte valores inteiros em reais', () => {
    expect(valorPorExtenso(1)).toBe('um real');
    expect(valorPorExtenso(2)).toBe('dois reais');
    expect(valorPorExtenso(100)).toBe('cem reais');
  });

  it('converte apenas centavos', () => {
    expect(valorPorExtenso(0.99)).toBe('noventa e nove centavos');
    expect(valorPorExtenso(0.01)).toBe('um centavo');
  });

  it('converte reais e centavos juntos', () => {
    expect(valorPorExtenso(1234.56)).toBe(
      'mil, duzentos e trinta e quatro reais e cinquenta e seis centavos',
    );
    expect(valorPorExtenso(2.5)).toBe('dois reais e cinquenta centavos');
  });

  it('usa "de reais" para valores exatos em milhão/bilhão', () => {
    expect(valorPorExtenso(1000000)).toBe('um milhão de reais');
    expect(valorPorExtenso(2000000)).toBe('dois milhões de reais');
  });

  it('não usa "de reais" quando há grupos menores', () => {
    expect(valorPorExtenso(1500000)).toBe('um milhão e quinhentos mil reais');
  });

  it('converte zero', () => {
    expect(valorPorExtenso(0)).toBe('zero reais');
  });

  it('trata arredondamento de centavos que estoura para 100', () => {
    expect(valorPorExtenso(1.999)).toBe('dois reais');
  });

  it('aplica o prefixo "menos" para valores negativos', () => {
    expect(valorPorExtenso(-5.5)).toBe('menos cinco reais e cinquenta centavos');
  });
});

describe('capitalizar', () => {
  it('deixa a primeira letra maiúscula', () => {
    expect(capitalizar('mil reais')).toBe('Mil reais');
  });

  it('lida com string vazia', () => {
    expect(capitalizar('')).toBe('');
  });
});
