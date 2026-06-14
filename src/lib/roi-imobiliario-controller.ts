/**
 * ROI Imobiliário Controller
 *
 * Camada de controle e apresentação para a Calculadora de ROI Imobiliário.
 * Conecta os inputs do DOM à lógica pura (roi-imobiliario-logic.ts) de forma reativa.
 *
 * Princípios S.O.L.I.D.:
 * - S: Single Responsibility — cada método faz uma coisa
 * - O: Open/Closed — extensível sem modificar
 * - D: Dependency Inversion — depende de funções puras
 */

import {
  type InputROI,
  type ResultadoROI,
  sanitizeNumber,
  calcularROIImobiliario,
} from './roi-imobiliario-logic';

import { formatCurrency } from './formatters';

import {
  getElement,
  getInputValue,
  addEventListenerSafe,
  debounce,
} from './dom-controller';

// ============================================================
// CONSTANTES DE SELETORES
// ============================================================

const SELECTORS = {
  INPUT_COMPRA: '#roi-compra',
  INPUT_INICIAIS: '#roi-iniciais',
  INPUT_ALUGUEL: '#roi-aluguel',
  INPUT_CUSTOS_MES: '#roi-custos-mes',
  INPUT_VALORIZACAO: '#roi-valorizacao',

  RES_CAP_RATE: '#res-cap-rate',
  RES_ROI_TOTAL: '#res-roi-total',
  RES_TOTAL_INVESTIDO: '#res-total-investido',
  RES_ALUGUEL_ANO: '#res-aluguel-ano',
  RES_VALORIZACAO_ANO: '#res-valorizacao-ano',
  RES_LUCRO_ABSOLUTO_ANO: '#res-lucro-absoluto-ano',
} as const;

// ============================================================
// CONTROLLER
// ============================================================

export class ROIImobiliarioController {
  private readonly elements: Map<string, HTMLElement> = new Map();
  private initialized = false;

  public init(): void {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.render();
      this.initialized = true;
      console.log('[ROIImobiliarioController] Inicializado com sucesso');
    } catch (error) {
      console.error('[ROIImobiliarioController] Erro na inicialização:', error);
    }
  }

  private cacheElements(): void {
    const selectors = Object.values(SELECTORS);
    for (const selector of selectors) {
      const el = getElement<HTMLElement>(selector);
      if (el) {
        this.elements.set(selector, el);
      } else {
        console.warn(`[ROIImobiliarioController] Elemento não encontrado: ${selector}`);
      }
    }
  }

  private bindEvents(): void {
    const debouncedRender = debounce(() => this.render(), 150);

    const inputSelectors = [
      SELECTORS.INPUT_COMPRA,
      SELECTORS.INPUT_INICIAIS,
      SELECTORS.INPUT_ALUGUEL,
      SELECTORS.INPUT_CUSTOS_MES,
      SELECTORS.INPUT_VALORIZACAO,
    ];

    for (const selector of inputSelectors) {
      addEventListenerSafe(selector, 'input', debouncedRender);
    }
  }

  private collectInput(): InputROI {
    return {
      valorCompra: sanitizeNumber(getInputValue(SELECTORS.INPUT_COMPRA)),
      custosIniciais: sanitizeNumber(getInputValue(SELECTORS.INPUT_INICIAIS)),
      valorAluguelMensal: sanitizeNumber(getInputValue(SELECTORS.INPUT_ALUGUEL)),
      custosMensaisObra: sanitizeNumber(getInputValue(SELECTORS.INPUT_CUSTOS_MES)),
      valorizacaoAnualPrevia: sanitizeNumber(getInputValue(SELECTORS.INPUT_VALORIZACAO)),
    };
  }

  private render(): void {
    try {
      const input = this.collectInput();
      const resultado: ResultadoROI = calcularROIImobiliario(input);
      this.renderResults(resultado);
    } catch (error) {
      console.error('[ROIImobiliarioController] Erro no render:', error);
      this.renderFallback();
    }
  }

  private renderResults(r: ResultadoROI): void {
    this.setTextSafe(SELECTORS.RES_CAP_RATE, `${r.capRatePercentual.toFixed(2)}%`);
    this.setTextSafe(SELECTORS.RES_ROI_TOTAL, `${r.roiAnualPercentual.toFixed(2)}%`);
    this.setTextSafe(SELECTORS.RES_TOTAL_INVESTIDO, formatCurrency(r.investimentoTotal));
    this.setTextSafe(SELECTORS.RES_ALUGUEL_ANO, formatCurrency(r.ganhoAluguelAnualLiquido));
    this.setTextSafe(SELECTORS.RES_VALORIZACAO_ANO, formatCurrency(r.valorizacaoPatrimonialAnual));
    this.setTextSafe(SELECTORS.RES_LUCRO_ABSOLUTO_ANO, formatCurrency(r.retornoAnualTotal));
  }

  private renderFallback(): void {
    const zero = 'R$ 0,00';
    this.setTextSafe(SELECTORS.RES_CAP_RATE, '0,00%');
    this.setTextSafe(SELECTORS.RES_ROI_TOTAL, '0,00%');
    this.setTextSafe(SELECTORS.RES_TOTAL_INVESTIDO, zero);
    this.setTextSafe(SELECTORS.RES_ALUGUEL_ANO, zero);
    this.setTextSafe(SELECTORS.RES_VALORIZACAO_ANO, zero);
    this.setTextSafe(SELECTORS.RES_LUCRO_ABSOLUTO_ANO, zero);
  }

  private setTextSafe(selector: string, text: string): void {
    const el = this.elements.get(selector);
    if (el) {
      el.textContent = text;
    }
  }
}

// ============================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================

export function initROIImobiliarioController(): void {
  if (typeof window === 'undefined') return;

  const bootstrap = () => {
    const controller = new ROIImobiliarioController();
    controller.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
}
