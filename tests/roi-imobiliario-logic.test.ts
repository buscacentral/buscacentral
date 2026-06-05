import { describe, it, expect } from 'vitest';
import { sanitizeNumber, calcularROIImobiliario } from '../src/lib/roi-imobiliario-logic';

describe('roi-imobiliario-logic', () => {
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
  });

  describe('calcularROIImobiliario', () => {
    it('calcula cenário completo', () => {
      const result = calcularROIImobiliario({
        valorCompra: 350000,
        custosIniciais: 25000,
        valorAluguelMensal: 1800,
        custosMensaisObra: 150,
        valorizacaoAnualPrevia: 5.5,
      });

      expect(result.investimentoTotal).toBe(375000);
      expect(result.ganhoAluguelAnualBruto).toBe(21600);
      expect(result.ganhoAluguelAnualLiquido).toBe(19800);
      expect(result.valorizacaoPatrimonialAnual).toBe(19250);
      expect(result.retornoAnualTotal).toBe(39050);
      expect(result.capRatePercentual).toBe(5.28);
      expect(result.roiAnualPercentual).toBe(10.41);
    });

    it('retorna zeros quando todos os inputs são 0', () => {
      const result = calcularROIImobiliario({
        valorCompra: 0,
        custosIniciais: 0,
        valorAluguelMensal: 0,
        custosMensaisObra: 0,
        valorizacaoAnualPrevia: 0,
      });

      expect(result.investimentoTotal).toBe(0);
      expect(result.capRatePercentual).toBe(0);
      expect(result.roiAnualPercentual).toBe(0);
    });

    it('não gera NaN com inputs inválidos', () => {
      const result = calcularROIImobiliario({
        valorCompra: NaN,
        custosIniciais: NaN,
        valorAluguelMensal: NaN,
        custosMensaisObra: NaN,
        valorizacaoAnualPrevia: NaN,
      });

      expect(Number.isFinite(result.investimentoTotal)).toBe(true);
      expect(Number.isFinite(result.capRatePercentual)).toBe(true);
      expect(Number.isFinite(result.roiAnualPercentual)).toBe(true);
    });

    it('aluguel líquido nunca é negativo', () => {
      const result = calcularROIImobiliario({
        valorCompra: 100000,
        custosIniciais: 0,
        valorAluguelMensal: 500,
        custosMensaisObra: 600,
        valorizacaoAnualPrevia: 0,
      });

      expect(result.ganhoAluguelAnualLiquido).toBe(0);
    });

    it('cap rate é calculado corretamente', () => {
      const result = calcularROIImobiliario({
        valorCompra: 100000,
        custosIniciais: 0,
        valorAluguelMensal: 1000,
        custosMensaisObra: 0,
        valorizacaoAnualPrevia: 0,
      });

      expect(result.capRatePercentual).toBe(12);
    });
  });
});
