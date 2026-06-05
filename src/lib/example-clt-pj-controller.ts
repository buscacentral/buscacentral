/**
 * Example: CLT→PJ Controller
 * 
 * Exemplo completo de como usar os módulos de lógica e controller
 * para criar uma ferramenta performática e modular.
 * 
 * ARQUITETURA:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                      CAMADA DE APRESENTAÇÃO                 │
 * │  (DOM Events, User Input, Result Display)                   │
 * │                                                             │
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │              DOM CONTROLLER                         │   │
 * │  │  - Captura inputs do formulário                     │   │
 * │  │  - Sanitiza dados de entrada                        │   │
 * │  │  - Chama funções de lógica                          │   │
 * │  │  - Renderiza resultados                             │   │
 * │  │  - Trata erros graciosamente                        │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                      CAMADA DE LÓGICA                        │
 * │  (Cálculos Matemáticos, Regras de Negócio)                   │
 * │                                                             │
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │              CLT-PJ LOGIC                            │   │
 * │  │  - Funções puras (mesmo input = mesmo output)       │   │
 * │  │  - Zero efeitos colaterais                          │   │
 * │  │  - Zero dependências externas                       │   │
 * │  │  - Facilmente testável                              │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────┘
 *                              │
 *                              ▼
 * ┌─────────────────────────────────────────────────────────────┐
 * │                      CAMADA DE FORMATAÇÃO                    │
 * │  (Moedas, Datas, Números, Documentos)                        │
 * │                                                             │
 * │  ┌─────────────────────────────────────────────────────┐   │
 * │  │              FORMATTERS                              │   │
 * │  │  - Usa Intl API nativa do navegador                 │   │
 * │  │  - Zero dependências externas                       │   │
 * │  │  - Performance máxima                               │   │
 * │  └─────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────┘
 */

import {
  type InputCLT,
  type InputPJ,
  type ResultadoComparacao,
  sanitizeNumber,
  validarInputCLT,
  calcularComparacaoCLTPJ,
} from './clt-pj-logic';

import {
  formatCurrency,
  formatDecimal,
  formatPercent,
} from './formatters';

import {
  BaseController,
  getElement,
  getInputValue,
  setInnerHTML,
  setTextContent,
  setVisible,
  addEventListenerSafe,
  debounce,
  announceToScreenReader,
} from './dom-controller';

// ============================================================
// CONSTANTES
// ============================================================

const DEFAULT_CLT_INPUT: InputCLT = {
  salarioBruto: 5000,
  mesesTrabalhados: 12,
  valeRefeicao: 1000,
  planoSaude: 500,
  planoOdontologico: 0,
  valeTransporte: 0,
  receberVT: false,
  gympass: 100,
  outrosBeneficios: 0,
  plrAnual: 0,
};

const DEFAULT_PJ_INPUT: InputPJ = {
  contador: 100,
  aliquotaSimples: 0.06,
};

// ============================================================
// CONTROLLER
// ============================================================

/**
 * Controller para a página CLT→PJ.
 * Gerencia a interação entre DOM e lógica de negócio.
 */
class CLTPJController extends BaseController {
  constructor() {
    super({
      formId: '#clt-pj-form',
      resultId: '#resultado',
      errorId: '#error-message',
      loadingClass: 'loading',
    });
  }

  /**
   * Inicializa o controller.
   */
  public init(): void {
    try {
      this.setupEventListeners();
      this.loadDefaultValues();
      console.log('[CLTPJController] Inicializado com sucesso');
    } catch (error) {
      console.error('[CLTPJController] Erro na inicialização:', error);
      this.showError('Erro ao inicializar a calculadora');
    }
  }

  /**
   * Configura os event listeners do formulário.
   */
  private setupEventListeners(): void {
    // Botão calcular
    addEventListenerSafe('#btn-calcular', 'click', () => {
      this.handleCalculate();
    });

    // Botão limpar
    addEventListenerSafe('#btn-limpar', 'click', () => {
      this.handleReset();
    });

    // Debounce para cálculo automático ao digitar
    const debouncedCalculate = debounce(() => {
      this.handleCalculate();
    }, 500);

    // Adiciona debounce em todos os inputs
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="number"]');
    inputs.forEach((input) => {
      input.addEventListener('input', debouncedCalculate);
    });
  }

  /**
   * Carrega valores padrão nos campos.
   */
  private loadDefaultValues(): void {
    const fields: Record<string, number> = {
      '#salario-bruto': DEFAULT_CLT_INPUT.salarioBruto,
      '#meses-trabalhados': DEFAULT_CLT_INPUT.mesesTrabalhados,
      '#vale-refeicao': DEFAULT_CLT_INPUT.valeRefeicao,
      '#plano-saude': DEFAULT_CLT_INPUT.planoSaude,
      '#gympass': DEFAULT_CLT_INPUT.gympass,
      '#plr-anual': DEFAULT_CLT_INPUT.plrAnual,
      '#contador': DEFAULT_PJ_INPUT.contador,
    };

    Object.entries(fields).forEach(([selector, value]) => {
      const input = getElement<HTMLInputElement>(selector);
      if (input) {
        input.value = value.toString();
      }
    });
  }

  /**
   * Coleta e sanitiza os dados do formulário.
   */
  private collectFormData(): { clt: InputCLT; pj: InputPJ } {
    const clt: InputCLT = {
      salarioBruto: sanitizeNumber(getInputValue('#salario-bruto'), DEFAULT_CLT_INPUT.salarioBruto),
      mesesTrabalhados: sanitizeNumber(getInputValue('#meses-trabalhados'), DEFAULT_CLT_INPUT.mesesTrabalhados),
      valeRefeicao: sanitizeNumber(getInputValue('#vale-refeicao'), 0),
      planoSaude: sanitizeNumber(getInputValue('#plano-saude'), 0),
      planoOdontologico: sanitizeNumber(getInputValue('#plano-odontologico'), 0),
      valeTransporte: sanitizeNumber(getInputValue('#vale-transporte'), 0),
      receberVT: false,
      gympass: sanitizeNumber(getInputValue('#gympass'), 0),
      outrosBeneficios: sanitizeNumber(getInputValue('#outros-beneficios'), 0),
      plrAnual: sanitizeNumber(getInputValue('#plr-anual'), 0),
    };

    const pj: InputPJ = {
      contador: sanitizeNumber(getInputValue('#contador'), DEFAULT_PJ_INPUT.contador),
      aliquotaSimples: DEFAULT_PJ_INPUT.aliquotaSimples,
    };

    return { clt, pj };
  }

  /**
   * Manipula o clique no botão calcular.
   */
  private handleCalculate(): void {
    try {
      // Coleta dados do formulário
      const { clt, pj } = this.collectFormData();

      // Valida entrada
      const validation = validarInputCLT(clt);
      if (!validation.isValid) {
        this.showError(validation.error ?? 'Dados inválidos');
        return;
      }

      // Executa cálculo (função pura)
      const resultado = calcularComparacaoCLTPJ(clt, pj);

      // Renderiza resultado
      this.renderResultado(resultado);

      // Anuncia para leitores de tela
      announceToScreenReader(
        `Cálculo concluído. ${resultado.vantagem === 'PJ' ? 'PJ é mais vantajoso' : 'CLT é mais vantajoso'} com diferença de ${formatCurrency(Math.abs(resultado.diferenca))}`
      );

      console.log('[CLTPJController] Cálculo realizado:', resultado);
    } catch (error) {
      console.error('[CLTPJController] Erro no cálculo:', error);
      this.showError('Erro ao calcular. Verifique os valores informados.');
    }
  }

  /**
   * Manipula o clique no botão limpar.
   */
  private handleReset(): void {
    try {
      this.loadDefaultValues();
      setVisible('#resultado', false);
      this.hideError();
      announceToScreenReader('Calculadora resetada para valores padrão');
    } catch (error) {
      console.error('[CLTPJController] Erro ao resetar:', error);
    }
  }

  /**
   * Renderiza o resultado na tela.
   */
  private renderResultado(resultado: ResultadoComparacao): void {
    const { clt, pj, diferenca, percentual, vantagem } = resultado;

    // Monta HTML do resultado
    const html = `
      <div class="resultado-header">
        <h2>Resultado da Comparação</h2>
        <div class="vantagem-badge ${vantagem === 'PJ' ? 'vantagem-pj' : 'vantagem-clt'}">
          ${vantagem === 'PJ' ? '✅ PJ é mais vantajoso' : '✅ CLT é mais vantajoso'}
        </div>
      </div>

      <div class="resultado-grid">
        <div class="resultado-card clt">
          <h3>CLT</h3>
          <div class="valor-principal">${formatCurrency(clt.ganhoRealCLT)}</div>
          <div class="label">Ganho Real Mensal</div>
          
          <div class="detalhes">
            <div class="linha">
              <span>Salário Bruto</span>
              <span>${formatCurrency(clt.bruto)}</span>
            </div>
            <div class="linha desconto">
              <span>(-) INSS</span>
              <span>-${formatCurrency(clt.inss)}</span>
            </div>
            <div class="linha desconto">
              <span>(-) IRRF</span>
              <span>-${formatCurrency(clt.irrf)}</span>
            </div>
            <div class="linha">
              <span>(+) Benefícios</span>
              <span>+${formatCurrency(clt.totalBeneficios)}</span>
            </div>
            <div class="linha">
              <span>(+) PLR Diluída</span>
              <span>+${formatCurrency(clt.plrMensal)}</span>
            </div>
          </div>
        </div>

        <div class="resultado-card pj">
          <h3>PJ</h3>
          <div class="valor-principal">${formatCurrency(pj.liquido)}</div>
          <div class="label">Líquido Mensal</div>
          
          <div class="detalhes">
            <div class="linha">
              <span>Faturamento</span>
              <span>${formatCurrency(pj.faturamento)}</span>
            </div>
            <div class="linha desconto">
              <span>(-) Simples Nacional</span>
              <span>-${formatCurrency(pj.impostoSimples)}</span>
            </div>
            <div class="linha desconto">
              <span>(-) Contador</span>
              <span>-${formatCurrency(pj.contador)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="resultado-diferenca">
        <div class="diferenca-valor ${diferenca >= 0 ? 'positivo' : 'negativo'}">
          ${diferenca >= 0 ? '+' : ''}${formatCurrency(diferenca)}
        </div>
        <div class="diferenca-percentual">
          ${formatPercent(percentual / 100)} ${vantagem === 'PJ' ? 'a mais como PJ' : 'a mais como CLT'}
        </div>
      </div>

      <div class="resultado-provisao">
        <h3>Provisão Anual CLT (que o PJ não tem)</h3>
        <div class="provisao-grid">
          <div class="provisao-item">
            <span>13º Proporcional</span>
            <span>${formatCurrency(clt.decimoTerceiro)}</span>
          </div>
          <div class="provisao-item">
            <span>Férias Proporcionais</span>
            <span>${formatCurrency(clt.ferias)}</span>
          </div>
          <div class="provisao-item">
            <span>1/3 de Férias</span>
            <span>${formatCurrency(clt.umTercoFerias)}</span>
          </div>
          <div class="provisao-item">
            <span>FGTS Acumulado</span>
            <span>${formatCurrency(clt.fgtsAcumulado)}</span>
          </div>
          <div class="provisao-item">
            <span>Multa FGTS (40%)</span>
            <span>${formatCurrency(clt.multaFgts)}</span>
          </div>
          <div class="provisao-total">
            <span>Total Anual</span>
            <span>${formatCurrency(clt.provisaoAnualCLT)}</span>
          </div>
        </div>
      </div>
    `;

    // Renderiza no DOM
    setInnerHTML('#resultado', html);
    setVisible('#resultado', true);
  }

  /**
   * Renderiza o estado atual (implementação da classe base).
   */
  protected render(): void {
    // A renderização é feita diretamente nos métodos específicos
    // Esta implementação pode ser expandida se necessário
  }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

/**
 * Inicializa o controller quando o DOM estiver pronto.
 */
export function initCLTPJController(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const controller = new CLTPJController();
      controller.init();
    });
  } else {
    const controller = new CLTPJController();
    controller.init();
  }
}

// Auto-inicialização se importado diretamente
if (typeof window !== 'undefined') {
  initCLTPJController();
}
