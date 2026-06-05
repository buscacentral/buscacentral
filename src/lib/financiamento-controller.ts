/**
 * Financiamento Controller
 *
 * Camada de controle e apresentação para o Simulador de Financiamento SAC vs Price.
 * Conecta os inputs do DOM à lógica pura (financiamento-logic.ts) de forma reativa.
 *
 * ARQUITETURA:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CAMADA DE APRESENTAÇÃO                    │
 * │  (DOM Events → Capture → Logic × 2 → Format → Render)      │
 * │                                                             │
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │           FINANCIMENTO CONTROLLER                    │   │
 * │  │  - Escuta input/change em todos os campos            │   │
 * │  │  - Captura e sanitiza valores do DOM                 │   │
 * │  │  - Invoca calcularPrice() e calcularSAC() em paralelo│   │
 * │  │  - Formata com Intl API (R$ 1.234,56)                │   │
 * │  │  - Atualiza painéis lado a lado instantaneamente     │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CAMADA DE LÓGICA                          │
 * │  (financiamento-logic.ts — funções puras)                    │
 * │  calcularPrice() + calcularSAC() + gerarResumo()             │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CAMADA DE FORMATAÇÃO                      │
 * │  (formatters.ts — Intl API nativa)                           │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Princípios S.O.L.I.D. aplicados:
 * - S: Single Responsibility — cada método faz uma coisa
 * - O: Open/Closed — extensível via herança sem modificar
 * - L: Liskov Substitution — BaseController é substituível
 * - I: Interface Segregation — interfaces mínimas
 * - D: Dependency Inversion — depende de abstrações (funções puras)
 */

import {
  type InputFinanciamento,
  type ResultadoFinanciamento,
  sanitizeNumber,
  calcularFinanciamento,
} from './financiamento-logic';

import {
  formatCurrency,
} from './formatters';

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
  // Inputs do formulário
  INPUT_VALOR_IMOVEL: '#fin-valor-imovel',
  INPUT_VALOR_ENTRADA: '#fin-valor-entrada',
  INPUT_PRAZO_MESES: '#fin-prazo-meses',
  INPUT_TAXA_JUROS: '#fin-taxa-juros',

  // Outputs — painel SAC
  SAC_FINANCIADO: '#sac-financiado',
  SAC_PRIMEIRA: '#sac-primeira',
  SAC_ULTIMA: '#sac-ultima',
  SAC_TOTAL_PAGO: '#sac-total-pago',
  SAC_TOTAL_JUROS: '#sac-total-juros',

  // Outputs — painel Price
  PRICE_FINANCIADO: '#price-financiado',
  PRICE_PARCELA: '#price-parcela',
  PRICE_TOTAL_PAGO: '#price-total-pago',
  PRICE_TOTAL_JUROS: '#price-total-juros',

  // Outputs — comparativo
  COMP_ECONOMIA: '#comp-economia',
  COMP_MELHOR: '#comp-melhor',
} as const;

// ============================================================
// CONTROLLER
// ============================================================

/**
 * Controller reativo para o Simulador de Financiamento SAC vs Price.
 *
 * Responsabilidade única: orquestrar o fluxo DOM → Lógica → Formatação → Render.
 * Não contém lógica de negócio (financiamento-logic.ts) nem formatação (formatters.ts).
 */
export class FinanciamentoController {
  /** Cache de referências DOM para evitar queries repetidas */
  private readonly elements: Map<string, HTMLElement> = new Map();

  /** Flag de inicialização para evitar double-bind */
  private initialized = false;

  // --------------------------------------------------------
  // INICIALIZAÇÃO
  // --------------------------------------------------------

  /**
   * Inicializa o controller: busca elementos, vincula eventos, renderiza estado inicial.
   * Idempotente — chamadas múltiplas não duplicam event listeners.
   */
  public init(): void {
    if (this.initialized) return;

    try {
      this.cacheElements();
      this.bindEvents();
      this.render();
      this.initialized = true;
      console.log('[FinanciamentoController] Inicializado com sucesso');
    } catch (error) {
      console.error('[FinanciamentoController] Erro na inicialização:', error);
    }
  }

  // --------------------------------------------------------
  // CACHE DE ELEMENTOS
  // --------------------------------------------------------

  /**
   * Busca e armazena referências DOM para evitar queries repetidas a cada keystroke.
   * Se qualquer elemento obrigatório não for encontrado, loga warning mas não quebra.
   */
  private cacheElements(): void {
    const selectors = Object.values(SELECTORS);

    for (const selector of selectors) {
      const el = getElement<HTMLElement>(selector);
      if (el) {
        this.elements.set(selector, el);
      } else {
        console.warn(`[FinanciamentoController] Elemento não encontrado: ${selector}`);
      }
    }
  }

  // --------------------------------------------------------
  // VINCULAÇÃO DE EVENTOS
  // --------------------------------------------------------

  /**
   * Vincula listeners de `input` em todos os campos do formulário simultaneamente.
   * Usa debounce de 150ms para evitar excesso de cálculos durante digitação rápida.
   *
   * Campos monitorados:
   * - Valor do Imóvel (text input)
   * - Valor da Entrada (text input)
   * - Prazo em Meses (range input)
   * - Taxa de Juros Anual (text input)
   */
  private bindEvents(): void {
    const debouncedRender = debounce(() => this.render(), 150);

    // Inputs de texto: disparam a cada tecla (evento 'input')
    const textInputs = [
      SELECTORS.INPUT_VALOR_IMOVEL,
      SELECTORS.INPUT_VALOR_ENTRADA,
      SELECTORS.INPUT_TAXA_JUROS,
    ];

    for (const selector of textInputs) {
      addEventListenerSafe(selector, 'input', debouncedRender);
    }

    // Range input (prazo): dispara ao arrastar (evento 'input')
    addEventListenerSafe(SELECTORS.INPUT_PRAZO_MESES, 'input', debouncedRender);
  }

  // --------------------------------------------------------
  // CAPTURA DE DADOS (DOM → InputFinanciamento)
  // --------------------------------------------------------

  /**
   * Captura os valores crus do DOM e os sanitiza.
   * Garante fallback seguro (0) para campos vazios ou inválidos.
   *
   * Regra defensiva: se Entrada >= Valor do Imóvel, valorFinanciado será 0
   * e a tela renderizará "R$ 0,00" em todos os campos de resultado.
   *
   * @returns InputFinanciamento sanitizado, pronto para a lógica pura
   */
  private collectInput(): InputFinanciamento {
    const valorImovel = sanitizeNumber(getInputValue(SELECTORS.INPUT_VALOR_IMOVEL));
    const valorEntrada = sanitizeNumber(getInputValue(SELECTORS.INPUT_VALOR_ENTRADA));
    const prazoMeses = Math.trunc(sanitizeNumber(getInputValue(SELECTORS.INPUT_PRAZO_MESES)));
    const taxaJurosAnual = sanitizeNumber(getInputValue(SELECTORS.INPUT_TAXA_JUROS));

    return {
      valorImovel,
      valorEntrada,
      prazoMeses,
      taxaJurosAnual,
    };
  }

  // --------------------------------------------------------
  // RENDERIZAÇÃO (Resultado → DOM)
  // --------------------------------------------------------

  /**
   * Pipeline completo: captura → cálculo duplo → formatação → renderização.
   * Envolve toda a execução em try/catch defensivo.
   */
  private render(): void {
    try {
      // A) Captura valores do DOM
      const input = this.collectInput();

      // B) Invoca a função pura de cálculo (SAC + Price simultaneamente)
      const resultado: ResultadoFinanciamento = calcularFinanciamento(input);

      // C-D) Formata e atualiza os nós do DOM — painel SAC
      this.renderSAC(resultado);

      // C-D) Formata e atualiza os nós do DOM — painel Price
      this.renderPrice(resultado);

      // C-D) Formata e atualiza o comparativo
      this.renderComparativo(resultado);
    } catch (error) {
      console.error('[FinanciamentoController] Erro no render:', error);
      this.renderFallback();
    }
  }

  /**
   * Renderiza o painel de resultados do sistema SAC.
   *
   * @param resultado - ResultadoFinanciamento puro vindo da lógica
   */
  private renderSAC(resultado: ResultadoFinanciamento): void {
    const { resumoSAC, valorFinanciado } = resultado;

    this.setTextSafe(SELECTORS.SAC_FINANCIADO, formatCurrency(valorFinanciado));
    this.setTextSafe(SELECTORS.SAC_PRIMEIRA, formatCurrency(resumoSAC?.primeiraParcela ?? 0));
    this.setTextSafe(SELECTORS.SAC_ULTIMA, formatCurrency(resumoSAC?.ultimaParcela ?? 0));
    this.setTextSafe(SELECTORS.SAC_TOTAL_PAGO, formatCurrency(resumoSAC?.totalPago ?? 0));
    this.setTextSafe(SELECTORS.SAC_TOTAL_JUROS, formatCurrency(resumoSAC?.totalJuros ?? 0));
  }

  /**
   * Renderiza o painel de resultados do sistema Price.
   *
   * No sistema Price, primeira e última parcela são iguais.
   * Exibimos como "Parcela Fixa" no painel.
   *
   * @param resultado - ResultadoFinanciamento puro vindo da lógica
   */
  private renderPrice(resultado: ResultadoFinanciamento): void {
    const { resumoPrice, valorFinanciado } = resultado;

    this.setTextSafe(SELECTORS.PRICE_FINANCIADO, formatCurrency(valorFinanciado));
    this.setTextSafe(SELECTORS.PRICE_PARCELA, formatCurrency(resumoPrice?.primeiraParcela ?? 0));
    this.setTextSafe(SELECTORS.PRICE_TOTAL_PAGO, formatCurrency(resumoPrice?.totalPago ?? 0));
    this.setTextSafe(SELECTORS.PRICE_TOTAL_JUROS, formatCurrency(resumoPrice?.totalJuros ?? 0));
  }

  /**
   * Renderiza o bloco comparativo entre SAC e Price.
   *
   * @param resultado - ResultadoFinanciamento puro vindo da lógica
   */
  private renderComparativo(resultado: ResultadoFinanciamento): void {
    const { economia, melhorSistema } = resultado;

    this.setTextSafe(SELECTORS.COMP_ECONOMIA, formatCurrency(economia));

    const labelMelhor = melhorSistema === 'sac'
      ? 'SAC economiza mais'
      : melhorSistema === 'price'
        ? 'Price economiza mais'
        : 'Empate técnico';

    this.setTextSafe(SELECTORS.COMP_MELHOR, labelMelhor);
  }

  /**
   * Renderiza estado fallback (zeros) em caso de erro inesperado.
   * Garante que a tela nunca mostre NaN ou quebras visuais.
   */
  private renderFallback(): void {
    const zero = 'R$ 0,00';

    // SAC
    this.setTextSafe(SELECTORS.SAC_FINANCIADO, zero);
    this.setTextSafe(SELECTORS.SAC_PRIMEIRA, zero);
    this.setTextSafe(SELECTORS.SAC_ULTIMA, zero);
    this.setTextSafe(SELECTORS.SAC_TOTAL_PAGO, zero);
    this.setTextSafe(SELECTORS.SAC_TOTAL_JUROS, zero);

    // Price
    this.setTextSafe(SELECTORS.PRICE_FINANCIADO, zero);
    this.setTextSafe(SELECTORS.PRICE_PARCELA, zero);
    this.setTextSafe(SELECTORS.PRICE_TOTAL_PAGO, zero);
    this.setTextSafe(SELECTORS.PRICE_TOTAL_JUROS, zero);

    // Comparativo
    this.setTextSafe(SELECTORS.COMP_ECONOMIA, zero);
    this.setTextSafe(SELECTORS.COMP_MELHOR, '-');
  }

  // --------------------------------------------------------
  // UTILITÁRIOS INTERNOS
  // --------------------------------------------------------

  /**
   * Define o texto de um elemento do DOM de forma segura.
   * Usa o cache de elementos para performance.
   *
   * @param selector - Seletor CSS do elemento
   * @param text - Texto a ser definido
   */
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

/**
 * Inicializa o controller quando o DOM estiver pronto.
 * Seguro para SSR (verifica existência de `window`).
 */
export function initFinanciamentoController(): void {
  if (typeof window === 'undefined') return;

  const bootstrap = () => {
    const controller = new FinanciamentoController();
    controller.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
}
