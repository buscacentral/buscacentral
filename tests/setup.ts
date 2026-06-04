/**
 * Test Setup
 * 
 * Configuração global para todos os testes Vitest.
 */

import { vi } from 'vitest';

// Mock do fetch global
global.fetch = vi.fn();

// Mock do console.error para testes de erro
const originalConsoleError = console.error;
beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  console.error = originalConsoleError;
});
