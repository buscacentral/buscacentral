/**
 * Viagem Controller
 *
 * Camada de controle e apresentação para a Calculadora de Custo de Viagem.
 * Conecta os inputs do DOM à lógica pura (viagem-logic.ts) de forma reativa.
 *
 * ARQUITETURA:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CAMADA DE APRESENTAÇÃO                    │
 * │  (DOM Events → Capture → Logic → Format → Render)           │
 * │                                                             │
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │              VIAGEM CONTROLLER                       │   │
 * │  │  - Escuta input/change em todos os campos            │   │
 * │  │  - Captura e sanitiza valores do DOM                 │   │
 * │  │  - Invoca calcularCustoViagem() (função pura)        │   │
 * │  │  - Formata com Intl API                              │   │
 * │  │  - Atualiza nós do resultado                         │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CAMADA DE LÓGICA                          │
 * │  (viagem-logic.ts — funções puras, zero efeitos colaterais)  │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    CAMADA DE FORMATAÇÃO                      │
 * │  (formatters.ts — Intl API nativa)                           │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Princípios S.O.L.I.D. aplicados:
 * - S (Single Responsibility): cada método faz uma coisa
 * - O (Open/Closed): extensível via herança sem modificar
 * - L (Liskov Substitution): BaseController é substituível
 * - I (Interface Segregation): interfaces mínimas e específicas
 * - D (Dependency Inversion): depende de abstrações (funções puras)
 */

import {
  type InputViagem,
  type ResultadoViagem,
  type TipoTrajeto,
  sanitizeNumber,
  sanitizeTipoTrajeto,
  calcularCustoViagem,
} from './viagem-logic';

import {
  formatCurrency,
  formatDecimal,
  formatInteger,
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
  // Inputs
  INPUT_DISTANCIA: '#viagem-distancia',
  INPUT_CONSUMO: '#viagem-consumo',
  INPUT_PRECO: '#viagem-preco',
  INPUT_PEDAGIO: '#viagem-pedagio',
  RADIO_TIPO: 'input[name="viagem-tipo"]',

  // Outputs (painel de resultados)
  RES_DISTANCIA: '#res-distancia',
  RES_LITROS: '#res-litros',
  RES_CUSTO_COMBUSTIVEL: '#res-custo-combustivel',
  RES_CUSTO_PEDAGIO: '#res-custo-pedagio',
  RES_TOTAL: '#res-total',
} as const;

// ============================================================
// CONTROLLER
// ============================================================

/**
 * Controller reativo para a Calculadora de Custo de Viagem.
 *
 * Responsabilidade única: orquestrar o fluxo DOM → Lógica → Formatação → Render.
 * Não contém lógica de negócio (viagem-logic.ts) nem formatação (formatters.ts).
 */
export class ViagemController {
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
      console.log('[ViagemController] Inicializado com sucesso');
    } catch (error) {
      console.error('[ViagemController] Erro na inicialização:', error);
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
        console.warn(`[ViagemController] Elemento não encontrado: ${selector}`);
      }
    }
  }

  // --------------------------------------------------------
  // VINCULAÇÃO DE EVENTOS
  // --------------------------------------------------------

  /**
   * Vincula listeners de `input` e `change` em todos os campos simultaneamente.
   * Usa debounce de 150ms para evitar excesso de cálculos durante digitação rápida.
   */
  private bindEvents(): void {
    const debouncedRender = debounce(() => this.render(), 150);

    // Inputs numéricos: disparam a cada tecla (evento 'input')
    const inputSelectors = [
      SELECTORS.INPUT_DISTANCIA,
      SELECTORS.INPUT_CONSUMO,
      SELECTORS.INPUT_PRECO,
      SELECTORS.INPUT_PEDAGIO,
    ];

    for (const selector of inputSelectors) {
      addEventListenerSafe(selector, 'input', debouncedRender);
    }

    // Radios de tipo de trajeto: disparam ao selecionar (evento 'change')
    const radios = document.querySelectorAll<HTMLInputElement>(SELECTORS.RADIO_TIPO);
    radios.forEach((radio) => {
      radio.addEventListener('change', debouncedRender);
    });
  }

  // --------------------------------------------------------
  // CAPTURA DE DADOS (DOM → InputViagem)
  // --------------------------------------------------------

  /**
   * Captura os valores crus do DOM e os sanitiza.
   * Garante fallback seguro (0) para campos vazios ou inválidos.
   *
   * @returns InputViagem sanitizado, pronto para a lógica pura
   */
  private collectInput(): InputViagem {
    const distancia = sanitizeNumber(getInputValue(SELECTORS.INPUT_DISTANCIA));
    const consumo = sanitizeNumber(getInputValue(SELECTORS.INPUT_CONSUMO));
    const precoCombustivel = sanitizeNumber(getInputValue(SELECTORS.INPUT_PRECO));
    const pedagio = sanitizeNumber(getInputValue(SELECTORS.INPUT_PEDAGIO));

    // Tipo de trajeto: encontra o radio selecionado
    const radioSelecionado = document.querySelector<HTMLInputElement>(
      `${SELECTORS.RADIO_TIPO}:checked`
    );
    const tipoTrajeto: TipoTrajeto = sanitizeTipoTrajeto(radioSelecionado?.value);

    return {
      distancia,
      consumo,
      precoCombustivel,
      pedagio,
      tipoTrajeto,
    };
  }

  // --------------------------------------------------------
  // RENDERIZAÇÃO (Resultado → DOM)
  // --------------------------------------------------------

  /**
   * Pipeline completo: captura → cálculo → formatação → renderização.
   * Envolve toda a execução em try/catch defensivo.
   */
  private render(): void {
    try {
      // A) Captura valores do DOM
      const input = this.collectInput();

      // B) Invoca a função pura de cálculo
      const resultado: ResultadoViagem = calcularCustoViagem(input);

      // C-D) Formata e atualiza os nós do DOM
      this.renderResults(resultado);
    } catch (error) {
      console.error('[ViagemController] Erro no render:', error);
      this.renderFallback();
    }
  }

  /**
   * Formata os resultados com Intl API e atualiza os nós do DOM.
   *
   * @param resultado - ResultadoViagem puro vindo da lógica
   */
  private renderResults(resultado: ResultadoViagem): void {
    this.setTextSafe(SELECTORS.RES_DISTANCIA, `${formatInteger(resultado.distanciaTotal)} km`);
    this.setTextSafe(SELECTORS.RES_LITROS, `${formatDecimal(resultado.litrosNecessarios)} L`);
    this.setTextSafe(SELECTORS.RES_CUSTO_COMBUSTIVEL, formatCurrency(resultado.custoCombustivel));
    this.setTextSafe(SELECTORS.RES_CUSTO_PEDAGIO, formatCurrency(resultado.custoPedagio));
    this.setTextSafe(SELECTORS.RES_TOTAL, formatCurrency(resultado.custoTotal));
  }

  /**
   * Renderiza estado fallback (zeros) em caso de erro inesperado.
   * Garante que a tela nunca mostre NaN ou quebras visuais.
   */
  private renderFallback(): void {
    this.setTextSafe(SELECTORS.RES_DISTANCIA, '0 km');
    this.setTextSafe(SELECTORS.RES_LITROS, '0,0 L');
    this.setTextSafe(SELECTORS.RES_CUSTO_COMBUSTIVEL, 'R$ 0,00');
    this.setTextSafe(SELECTORS.RES_CUSTO_PEDAGIO, 'R$ 0,00');
    this.setTextSafe(SELECTORS.RES_TOTAL, 'R$ 0,00');
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
export function initViagemController(): void {
  if (typeof window === 'undefined') return;

  const bootstrap = () => {
    const controller = new ViagemController();
    controller.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
}
