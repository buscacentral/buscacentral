/**
 * DOM Controller Module
 * 
 * Módulo controlador para manipulação do DOM e eventos.
 * Separa completamente a lógica de apresentação da lógica de negócio.
 * 
 * Princípios aplicados:
 * - Single Responsibility (cada função faz uma coisa)
 * - Tratamento de erros robusto (try/catch em todo lugar)
 * - Feedback visual para o usuário
 * - Logs detalhados para debug
 * - Acessibilidade (ARIA labels, focus management)
 */

// ============================================================
// TIPOS
// ============================================================

export interface ControllerConfig {
  readonly formId: string;
  readonly resultId: string;
  readonly errorId: string;
  readonly loadingClass: string;
}

export interface ControllerState {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly data: unknown;
}

// ============================================================
// UTILITÁRIOS DOM (FUNÇÕES PURAS)
// ============================================================

/**
 * Obtém um elemento do DOM de forma segura.
 * 
 * @param selector - Seletor CSS ou ID do elemento
 * @returns Elemento encontrado ou null
 */
export function getElement<T extends HTMLElement>(selector: string): T | null {
  try {
    return document.querySelector<T>(selector);
  } catch (error) {
    console.error(`Erro ao buscar elemento "${selector}":`, error);
    return null;
  }
}

/**
 * Obtém o valor de um input de forma segura.
 * 
 * @param selector - Seletor CSS do input
 * @returns Valor do input ou string vazia
 */
export function getInputValue(selector: string): string {
  const input = getElement<HTMLInputElement>(selector);
  return input?.value?.trim() ?? '';
}

/**
 * Define o conteúdo HTML de um elemento de forma segura.
 * 
 * @param selector - Seletor CSS do elemento
 * @param html - Conteúdo HTML para definir
 */
export function setInnerHTML(selector: string, html: string): void {
  const element = getElement(selector);
  if (element) {
    element.innerHTML = html;
  }
}

/**
 * Define o texto de um elemento de forma segura.
 * 
 * @param selector - Seletor CSS do elemento
 * @param text - Texto para definir
 */
export function setTextContent(selector: string, text: string): void {
  const element = getElement(selector);
  if (element) {
    element.textContent = text;
  }
}

/**
 * Adiciona ou remove uma classe CSS de um elemento.
 * 
 * @param selector - Seletor CSS do elemento
 * @param className - Nome da classe
 * @param add - true para adicionar, false para remover
 */
export function toggleClass(selector: string, className: string, add: boolean): void {
  const element = getElement(selector);
  if (element) {
    element.classList.toggle(className, add);
  }
}

/**
 * Mostra ou esconde um elemento.
 * 
 * @param selector - Seletor CSS do elemento
 * @param visible - true para mostrar, false para esconder
 */
export function setVisible(selector: string, visible: boolean): void {
  const element = getElement<HTMLElement>(selector);
  if (element) {
    element.style.display = visible ? '' : 'none';
    element.setAttribute('aria-hidden', (!visible).toString());
  }
}

/**
 * Define o foco em um elemento.
 * 
 * @param selector - Seletor CSS do elemento
 */
export function focusElement(selector: string): void {
  const element = getElement<HTMLElement>(selector);
  if (element) {
    element.focus();
  }
}

// ============================================================
// CONTROLLER BASE (CLASSE ABSTRATA)
// ============================================================

/**
 * Controller base para páginas de ferramentas.
 * Fornece funcionalidades comuns de gerenciamento de estado e UI.
 * 
 * @example
 * ```typescript
 * class MeuController extends BaseController {
 *   protected handleSubmit(): void {
 *     this.withLoading(() => {
 *       const resultado = calcularAlgo();
 *       this.renderResultado(resultado);
 *     });
 *   }
 * }
 * ```
 */
export abstract class BaseController {
  protected state: ControllerState;
  private readonly config: ControllerConfig;

  constructor(config: ControllerConfig) {
    this.config = config;
    this.state = {
      isLoading: false,
      error: null,
      data: null,
    };
  }

  /**
   * Atualiza o estado e renderiza a UI.
   */
  protected updateState(updates: Partial<ControllerState>): void {
    this.state = { ...this.state, ...updates };
    this.render();
  }

  /**
   * Renderiza a UI baseada no estado atual.
   * Deve ser implementado pelas subclasses.
   */
  protected abstract render(): void;

  /**
   * Executa uma operação assíncrona com tratamento de loading e erro.
   * 
   * @param operation - Função assíncrona para executar
   * @param errorMessage - Mensagem de erro personalizada
   */
  protected async withLoading<T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Ocorreu um erro inesperado'
  ): Promise<T | null> {
    try {
      this.updateState({ isLoading: true, error: null });

      const result = await operation();

      this.updateState({ isLoading: false, data: result });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage;
      
      console.error(`[${this.constructor.name}] Erro:`, error);
      
      this.updateState({
        isLoading: false,
        error: message,
      });

      this.showError(message);
      return null;
    }
  }

  /**
   * Mostra uma mensagem de erro na UI.
   */
  protected showError(message: string): void {
    const errorElement = getElement(this.config.errorId);
    if (errorElement) {
      errorElement.textContent = message;
      setVisible(this.config.errorId, true);
      
      // Auto-hide após 5 segundos
      setTimeout(() => {
        setVisible(this.config.errorId, false);
      }, 5000);
    }
  }

  /**
   * Esconde a mensagem de erro.
   */
  protected hideError(): void {
    setVisible(this.config.errorId, false);
  }

  /**
   * Mostra o estado de loading.
   */
  protected showLoading(): void {
    toggleClass(this.config.resultId, this.config.loadingClass, true);
  }

  /**
   * Esconde o estado de loading.
   */
  protected hideLoading(): void {
    toggleClass(this.config.resultId, this.config.loadingClass, false);
  }

  /**
   * Inicializa o controller.
   * Deve ser chamado após o DOM estar pronto.
   */
  public abstract init(): void;
}

// ============================================================
// UTILITÁRIOS DE EVENTOS
// ============================================================

/**
 * Adiciona um event listener de forma segura.
 * 
 * @param selector - Seletor CSS do elemento
 * @param event - Nome do evento
 * @param handler - Função handler
 * @param options - Opções do event listener
 */
export function addEventListenerSafe(
  selector: string,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): void {
  const element = getElement(selector);
  if (element) {
    element.addEventListener(event, handler, options);
  }
}

/**
 * Cria um handler de debounce para eventos.
 * 
 * @param handler - Função para debounce
 * @param delay - Delay em milliseconds
 * @returns Função com debounce aplicado
 */
export function debounce<T extends (...args: unknown[]) => void>(
  handler: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => handler(...args), delay);
  };
}

/**
 * Cria um handler de throttle para eventos.
 * 
 * @param handler - Função para throttle
 * @param limit - Limite em milliseconds
 * @returns Função com throttle aplicado
 */
export function throttle<T extends (...args: unknown[]) => void>(
  handler: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      handler(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

// ============================================================
// UTILITÁRIOS DE FORMULÁRIO
// ============================================================

/**
 * Coleta os valores de um formulário em um objeto.
 * 
 * @param formSelector - Seletor CSS do formulário
 * @returns Objeto com os valores do formulário
 */
export function collectFormData(formSelector: string): Record<string, string> {
  const form = getElement<HTMLFormElement>(formSelector);
  if (!form) return {};

  const data: Record<string, string> = {};
  const inputs = form.querySelectorAll<HTMLInputElement>('input, select, textarea');

  inputs.forEach((input) => {
    const name = input.name || input.id;
    if (name) {
      data[name] = input.value;
    }
  });

  return data;
}

/**
 * Reseta um formulário para seus valores padrão.
 * 
 * @param formSelector - Seletor CSS do formulário
 */
export function resetForm(formSelector: string): void {
  const form = getElement<HTMLFormElement>(formSelector);
  if (form) {
    form.reset();
  }
}

/**
 * Valida se todos os campos obrigatórios estão preenchidos.
 * 
 * @param formSelector - Seletor CSS do formulário
 * @returns true se todos os obrigatórios estão preenchidos
 */
export function validateRequiredFields(formSelector: string): boolean {
  const form = getElement<HTMLFormElement>(formSelector);
  if (!form) return false;

  const requiredInputs = form.querySelectorAll<HTMLInputElement>('[required]');
  
  for (const input of requiredInputs) {
    if (!input.value.trim()) {
      input.focus();
      return false;
    }
  }

  return true;
}

// ============================================================
// UTILITÁRIOS DE ACESSIBILIDADE
// ============================================================

/**
 * Anuncia uma mensagem para leitores de tela.
 * 
 * @param message - Mensagem para anunciar
 */
export function announceToScreenReader(message: string): void {
  const announcer = getElement('#aria-announcer');
  if (announcer) {
    announcer.textContent = message;
  }
}

/**
 * Gerencia o foco para navegação por teclado.
 * 
 * @param containerSelector - Seletor do container
 * @param focusableSelector - Seletor dos elementos focáveis
 */
export function manageFocus(
  containerSelector: string,
  focusableSelector: string = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
): void {
  const container = getElement(containerSelector);
  if (!container) return;

  const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector);
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  });
}
