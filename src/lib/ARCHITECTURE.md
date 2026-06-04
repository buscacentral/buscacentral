# BuscaCentral - Padrão Arquitetural

## Visão Geral

Este documento descreve o padrão arquitetural utilizado nas ferramentas do BuscaCentral.
O objetivo é garantir código performático, modular, testável e livre de falhas silenciosas.

## Princípios

### 1. Separação de Responsabilidades (S.O.L.I.D.)

```
┌─────────────────────────────────────────────────────────────┐
│                      CAMADA DE APRESENTAÇÃO                 │
│  (DOM Events, User Input, Result Display)                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              DOM CONTROLLER                         │   │
│  │  - Captura inputs do formulário                     │   │
│  │  - Sanitiza dados de entrada                        │   │
│  │  - Chama funções de lógica                          │   │
│  │  - Renderiza resultados                             │   │
│  │  - Trata erros graciosamente                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CAMADA DE LÓGICA                        │
│  (Cálculos Matemáticos, Regras de Negócio)                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              [TOOL]-LOGIC                            │   │
│  │  - Funções puras (mesmo input = mesmo output)       │   │
│  │  - Zero efeitos colaterais                          │   │
│  │  - Zero dependências externas                       │   │
│  │  - Facilmente testável                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CAMADA DE FORMATAÇÃO                    │
│  (Moedas, Datas, Números, Documentos)                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              FORMATTERS                              │   │
│  │  - Usa Intl API nativa do navegador                 │   │
│  │  - Zero dependências externas                       │   │
│  │  - Performance máxima                               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Imutabilidade e Segurança de Dados

- Use `const` por padrão, `let` apenas quando necessário
- Nunca modifique dados de entrada (spread operator)
- Sanitize todos os inputs do usuário imediatamente
- Garanta que inputs vazios ou mal formatados virem 0 ou valores padrão

### 3. Performance Nativa (Zero Dependências)

- Use a API `Intl` para formatação de moedas, datas e números
- Use `Intl.NumberFormat` para moedas brasileiras
- Use `Intl.DateTimeFormat` para datas
- Nunca use bibliotecas externas para formatação

### 4. Tratamento de Erros e UX de Resiliência

- Enclausure fluxos em blocos `try/catch`
- Capture erros no console de forma detalhada
- Trate a interface graciosamente (não quebre)
- Exiba feedback visual amigável de erro

## Estrutura de Arquivos

```
src/lib/
├── clt-pj-logic.ts          # Lógica pura (cálculos)
├── formatters.ts             # Formatação (Intl API)
├── dom-controller.ts         # Controller base (DOM)
├── example-clt-pj-controller.ts  # Exemplo completo
└── ARCHITECTURE.md           # Este documento
```

## Como Criar uma Nova Ferramenta

### Passo 1: Criar o módulo de lógica

```typescript
// src/lib/[tool]-logic.ts

// Tipos
export interface InputData {
  readonly campo1: number;
  readonly campo2: number;
}

export interface Resultado {
  readonly valor1: number;
  readonly valor2: number;
}

// Constantes
const CONSTANTE_EXEMPLO = 0.08;

// Funções de validação
export function validarInput(input: InputData): { 
  readonly isValid: boolean; 
  readonly error?: string 
} {
  if (input.campo1 <= 0) {
    return { isValid: false, error: 'Campo 1 deve ser maior que zero' };
  }
  return { isValid: true };
}

// Funções de cálculo (PURAS)
export function calcularValor1(campo1: number): number {
  return campo1 * CONSTANTE_EXEMPLO;
}

export function calcularResultado(input: InputData): Resultado {
  return {
    valor1: calcularValor1(input.campo1),
    valor2: input.campo2,
  };
}
```

### Passo 2: Criar o controller

```typescript
// src/lib/[tool]-controller.ts

import { type InputData, type Resultado, validarInput, calcularResultado } from './[tool]-logic';
import { formatCurrency } from './formatters';
import { BaseController, getElement, getInputValue, sanitizeNumber } from './dom-controller';

class ToolController extends BaseController {
  constructor() {
    super({
      formId: '#tool-form',
      resultId: '#resultado',
      errorId: '#error-message',
      loadingClass: 'loading',
    });
  }

  public init(): void {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Adicione event listeners aqui
  }

  private handleCalculate(): void {
    try {
      // 1. Coletar e sanitizar dados
      const input: InputData = {
        campo1: sanitizeNumber(getInputValue('#campo1'), 0),
        campo2: sanitizeNumber(getInputValue('#campo2'), 0),
      };

      // 2. Validar
      const validation = validarInput(input);
      if (!validation.isValid) {
        this.showError(validation.error ?? 'Dados inválidos');
        return;
      }

      // 3. Calcular (função pura)
      const resultado = calcularResultado(input);

      // 4. Renderizar
      this.renderResultado(resultado);
    } catch (error) {
      console.error('[ToolController] Erro:', error);
      this.showError('Erro ao calcular');
    }
  }

  private renderResultado(resultado: Resultado): void {
    // Renderize o resultado aqui
  }

  protected render(): void {
    // Implementação vazia (renderização é feita nos métodos específicos)
  }
}
```

### Passo 3: Usar no componente React

```typescript
// src/app/[tool]/[Tool]Client.tsx

'use client';

import { useEffect } from 'react';
import { initToolController } from '@/lib/[tool]-controller';

export default function ToolClient() {
  useEffect(() => {
    initToolController();
  }, []);

  return (
    <div id="tool-form">
      {/* Seu formulário aqui */}
    </div>
  );
}
```

## Exemplos de Uso

### Formatação de Moeda

```typescript
import { formatCurrency } from '@/lib/formatters';

formatCurrency(1234.56);  // "R$ 1.234,56"
formatCurrency(0);        // "R$ 0,00"
formatCurrency(-50);      // "-R$ 50,00"
```

### Sanitização de Input

```typescript
import { sanitizeNumber } from '@/lib/clt-pj-logic';

sanitizeNumber('1.234,56');  // 1234.56
sanitizeNumber('');          // 0
sanitizeNumber('abc');       // 0
sanitizeNumber(null);        // 0
```

### Controller Base

```typescript
import { BaseController } from '@/lib/dom-controller';

class MeuController extends BaseController {
  constructor() {
    super({
      formId: '#meu-form',
      resultId: '#resultado',
      errorId: '#erro',
      loadingClass: 'loading',
    });
  }

  protected render(): void {
    // Implemente sua renderização
  }
}
```

## Benefícios

1. **Testabilidade**: Funções puras são facilmente testáveis
2. **Manutenção**: Mudanças na lógica não afetam a apresentação
3. **Performance**: Zero dependências externas, uso de APIs nativas
4. **Acessibilidade**: Suporte nativo a leitores de tela
5. **Resiliência**: Tratamento de erros robusto em cada camada

## Referências

- [S.O.L.I.D. Principles](https://en.wikipedia.org/wiki/SOLID)
- [Intl API](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Core Web Vitals](https://web.dev/vitals/)
