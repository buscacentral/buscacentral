import { describe, it, expect } from 'vitest';
import {
  sanitizeNumber,
  converterTaxaAnualParaMensal,
  calcularValorFinanciado,
  calcularPrice,
  calcularSAC,
  gerarResumo,
  calcularFinanciamento,
} from '../src/lib/financiamento-logic';

describe('financiamento-logic', () => {
  describe('sanitizeNumber', () => {
    it('retorna 0 para string vazia', () => {
      expect(sanitizeNumber('')).toBe(0);
    });

    it('retorna 0 para null/undefined', () => {
      expect(sanitizeNumber(null)).toBe(0);
      expect(sanitizeNumber(undefined)).toBe(0);
    });

    it('converte vírgula para ponto', () => {
      expect(sanitizeNumber('10,5')).toBe(10.5);
    });

    it('retorna 0 para valores negativos', () => {
      expect(sanitizeNumber('-5')).toBe(0);
    });

    it('retorna defaultValue para NaN', () => {
      expect(sanitizeNumber('abc', 99)).toBe(99);
    });

    it('aceita number diretamente', () => {
      expect(sanitizeNumber(42)).toBe(42);
    });
  });

  describe('converterTaxaAnualParaMensal', () => {
    it('retorna 0 para taxa 0', () => {
      expect(converterTaxaAnualParaMensal(0)).toBe(0);
    });

    it('converte 12% a.a. corretamente (~0.9489% a.m.)', () => {
      const mensal = converterTaxaAnualParaMensal(12);
      expect(mensal).toBeGreaterThan(0.009);
      expect(mensal).toBeLessThan(0.01);
    });

    it('converte 0% a.a. para 0% a.m.', () => {
      expect(converterTaxaAnualParaMensal(0)).toBe(0);
    });
  });

  describe('calcularValorFinanciado', () => {
    it('retorna valor - entrada', () => {
      expect(calcularValorFinanciado(200000, 50000)).toBe(150000);
    });

    it('retorna 0 se entrada >= valor', () => {
      expect(calcularValorFinanciado(200000, 200000)).toBe(0);
      expect(calcularValorFinanciado(200000, 250000)).toBe(0);
    });

    it('retorna 0 se ambos forem 0', () => {
      expect(calcularValorFinanciado(0, 0)).toBe(0);
    });
  });

  describe('calcularPrice', () => {
    it('retorna array vazio se financiado <= 0', () => {
      expect(calcularPrice(0, 0.01, 48)).toHaveLength(0);
    });

    it('retorna array vazio se taxa <= 0', () => {
      expect(calcularPrice(100000, 0, 48)).toHaveLength(0);
    });

    it('retorna array vazio se parcelas <= 0', () => {
      expect(calcularPrice(100000, 0.01, 0)).toHaveLength(0);
    });

    it('gera o número correto de parcelas', () => {
      const tabela = calcularPrice(100000, 0.01, 12);
      expect(tabela).toHaveLength(12);
    });

    it('parcelas Price são fixas', () => {
      const tabela = calcularPrice(100000, 0.01, 12);
      const primeira = tabela[0].parcela;
      const ultima = tabela[tabela.length - 1].parcela;
      expect(primeira).toBeCloseTo(ultima, 2);
    });

    it('saldo devedor final é ~0', () => {
      const tabela = calcularPrice(100000, 0.01, 12);
      const saldoFinal = tabela[tabela.length - 1].saldoDevedor;
      expect(saldoFinal).toBeLessThan(0.01);
    });
  });

  describe('calcularSAC', () => {
    it('retorna array vazio se financiado <= 0', () => {
      expect(calcularSAC(0, 0.01, 48)).toHaveLength(0);
    });

    it('gera o número correto de parcelas', () => {
      const tabela = calcularSAC(100000, 0.01, 12);
      expect(tabela).toHaveLength(12);
    });

    it('amortização SAC é constante', () => {
      const tabela = calcularSAC(100000, 0.01, 12);
      const amort1 = tabela[0].amortizacao;
      const amort6 = tabela[5].amortizacao;
      expect(amort1).toBeCloseTo(amort6, 2);
    });

    it('parcelas SAC são decrescentes', () => {
      const tabela = calcularSAC(100000, 0.01, 12);
      expect(tabela[0].parcela).toBeGreaterThan(tabela[11].parcela);
    });

    it('saldo devedor final é ~0', () => {
      const tabela = calcularSAC(100000, 0.01, 12);
      const saldoFinal = tabela[tabela.length - 1].saldoDevedor;
      expect(saldoFinal).toBeLessThan(0.01);
    });
  });

  describe('gerarResumo', () => {
    it('retorna null para tabela vazia', () => {
      expect(gerarResumo([])).toBeNull();
    });

    it('calcula totais corretamente', () => {
      const tabela = calcularPrice(100000, 0.01, 12);
      const resumo = gerarResumo(tabela);

      expect(resumo).not.toBeNull();
      expect(resumo!.primeiraParcela).toBeCloseTo(tabela[0].parcela, 2);
      expect(resumo!.ultimaParcela).toBeCloseTo(tabela[11].parcela, 2);
      expect(resumo!.totalPago).toBeGreaterThan(0);
      expect(resumo!.totalJuros).toBeGreaterThan(0);
    });

    it('totalPago = soma de todas as parcelas', () => {
      const tabela = calcularPrice(100000, 0.01, 12);
      const resumo = gerarResumo(tabela);
      const somaManual = tabela.reduce((s, p) => s + p.parcela, 0);
      expect(resumo!.totalPago).toBeCloseTo(somaManual, 2);
    });
  });

  describe('calcularFinanciamento (orquestração)', () => {
    it('calcula cenário completo', () => {
      const result = calcularFinanciamento({
        valorImovel: 200000,
        valorEntrada: 50000,
        prazoMeses: 48,
        taxaJurosAnual: 12,
      });

      expect(result.valorFinanciado).toBe(150000);
      expect(result.tabelaPrice).toHaveLength(48);
      expect(result.tabelaSAC).toHaveLength(48);
      expect(result.resumoPrice).not.toBeNull();
      expect(result.resumoSAC).not.toBeNull();
      expect(result.economia).toBeGreaterThan(0);
    });

    it('retorna zeros quando valor financiado é 0', () => {
      const result = calcularFinanciamento({
        valorImovel: 100000,
        valorEntrada: 100000,
        prazoMeses: 48,
        taxaJurosAnual: 12,
      });

      expect(result.valorFinanciado).toBe(0);
      expect(result.tabelaPrice).toHaveLength(0);
      expect(result.tabelaSAC).toHaveLength(0);
      expect(result.resumoPrice).toBeNull();
      expect(result.resumoSAC).toBeNull();
      expect(result.economia).toBe(0);
    });

    it('retorna zeros quando todos os inputs são 0', () => {
      const result = calcularFinanciamento({
        valorImovel: 0,
        valorEntrada: 0,
        prazoMeses: 0,
        taxaJurosAnual: 0,
      });

      expect(result.valorFinanciado).toBe(0);
      expect(result.economia).toBe(0);
      expect(result.melhorSistema).toBe('empate');
    });

    it('SAC tem menos juros que Price no mesmo cenário', () => {
      const result = calcularFinanciamento({
        valorImovel: 300000,
        valorEntrada: 60000,
        prazoMeses: 60,
        taxaJurosAnual: 12,
      });

      expect(result.resumoSAC!.totalJuros).toBeLessThan(result.resumoPrice!.totalJuros);
      expect(result.melhorSistema).toBe('sac');
    });

    it('entrada > valor do imóvel gera financiado 0', () => {
      const result = calcularFinanciamento({
        valorImovel: 100000,
        valorEntrada: 150000,
        prazoMeses: 48,
        taxaJurosAnual: 12,
      });

      expect(result.valorFinanciado).toBe(0);
      expect(result.tabelaPrice).toHaveLength(0);
    });
  });
});
