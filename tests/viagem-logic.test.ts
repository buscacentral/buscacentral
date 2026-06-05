import { describe, it, expect } from 'vitest';
import {
  sanitizeNumber,
  sanitizeTipoTrajeto,
  calcularDistanciaTotal,
  calcularLitros,
  calcularCustoCombustivel,
  calcularCustoPedagio,
  calcularCustoViagem,
} from '../src/lib/viagem-logic';

describe('viagem-logic', () => {
  describe('sanitizeNumber', () => {
    it('retorna 0 para string vazia', () => {
      expect(sanitizeNumber('')).toBe(0);
    });

    it('retorna 0 para null', () => {
      expect(sanitizeNumber(null)).toBe(0);
    });

    it('retorna 0 para undefined', () => {
      expect(sanitizeNumber(undefined)).toBe(0);
    });

    it('converte vírgula para ponto', () => {
      expect(sanitizeNumber('10,5')).toBe(10.5);
    });

    it('converte string numérica corretamente', () => {
      expect(sanitizeNumber('42')).toBe(42);
    });

    it('retorna defaultValue para NaN', () => {
      expect(sanitizeNumber('abc', 99)).toBe(99);
    });

    it('retorna 0 para valores negativos', () => {
      expect(sanitizeNumber('-5')).toBe(0);
    });

    it('aceita number diretamente', () => {
      expect(sanitizeNumber(15.7)).toBe(15.7);
    });
  });

  describe('sanitizeTipoTrajeto', () => {
    it('retorna "ida-volta" quando value é "ida-volta"', () => {
      expect(sanitizeTipoTrajeto('ida-volta')).toBe('ida-volta');
    });

    it('retorna "ida" para qualquer outro valor', () => {
      expect(sanitizeTipoTrajeto('ida')).toBe('ida');
      expect(sanitizeTipoTrajeto('x')).toBe('ida');
      expect(sanitizeTipoTrajeto(null)).toBe('ida');
      expect(sanitizeTipoTrajeto(undefined)).toBe('ida');
    });
  });

  describe('calcularDistanciaTotal', () => {
    it('retorna a mesma distância para "ida"', () => {
      expect(calcularDistanciaTotal(100, 'ida')).toBe(100);
    });

    it('dobra a distância para "ida-volta"', () => {
      expect(calcularDistanciaTotal(100, 'ida-volta')).toBe(200);
    });

    it('retorna 0 para distância 0', () => {
      expect(calcularDistanciaTotal(0, 'ida')).toBe(0);
    });
  });

  describe('calcularLitros', () => {
    it('calcula litros corretamente', () => {
      expect(calcularLitros(300, 10)).toBe(30);
    });

    it('retorna 0 se consumo for 0', () => {
      expect(calcularLitros(300, 0)).toBe(0);
    });

    it('retorna 0 se distância for 0', () => {
      expect(calcularLitros(0, 10)).toBe(0);
    });
  });

  describe('calcularCustoCombustivel', () => {
    it('calcula custo corretamente', () => {
      expect(calcularCustoCombustivel(30, 5.5)).toBeCloseTo(165);
    });

    it('retorna 0 se litros for 0', () => {
      expect(calcularCustoCombustivel(0, 5.5)).toBe(0);
    });
  });

  describe('calcularCustoPedagio', () => {
    it('retorna o mesmo valor para "ida"', () => {
      expect(calcularCustoPedagio(25, 'ida')).toBe(25);
    });

    it('dobra o valor para "ida-volta"', () => {
      expect(calcularCustoPedagio(25, 'ida-volta')).toBe(50);
    });

    it('retorna 0 se pedágio for 0', () => {
      expect(calcularCustoPedagio(0, 'ida-volta')).toBe(0);
    });
  });

  describe('calcularCustoViagem (orquestração)', () => {
    it('calcula cenário completo: ida simples', () => {
      const result = calcularCustoViagem({
        distancia: 300,
        consumo: 10,
        precoCombustivel: 5.5,
        pedagio: 25,
        tipoTrajeto: 'ida',
      });

      expect(result.distanciaTotal).toBe(300);
      expect(result.litrosNecessarios).toBe(30);
      expect(result.custoCombustivel).toBeCloseTo(165);
      expect(result.custoPedagio).toBe(25);
      expect(result.custoTotal).toBeCloseTo(190);
    });

    it('calcula cenário completo: ida e volta', () => {
      const result = calcularCustoViagem({
        distancia: 300,
        consumo: 10,
        precoCombustivel: 5.5,
        pedagio: 25,
        tipoTrajeto: 'ida-volta',
      });

      expect(result.distanciaTotal).toBe(600);
      expect(result.litrosNecessarios).toBe(60);
      expect(result.custoCombustivel).toBeCloseTo(330);
      expect(result.custoPedagio).toBe(50);
      expect(result.custoTotal).toBeCloseTo(380);
    });

    it('retorna zeros quando todos os inputs são 0', () => {
      const result = calcularCustoViagem({
        distancia: 0,
        consumo: 0,
        precoCombustivel: 0,
        pedagio: 0,
        tipoTrajeto: 'ida',
      });

      expect(result.distanciaTotal).toBe(0);
      expect(result.litrosNecessarios).toBe(0);
      expect(result.custoCombustivel).toBe(0);
      expect(result.custoPedagio).toBe(0);
      expect(result.custoTotal).toBe(0);
    });
  });
});
