import { test, expect, Page } from '@playwright/test';

/**
 * Smoke Test Global — BuscaCentral.com.br
 *
 * Objetivo: Varrer o portal garantindo que a estrutura de navegação principal
 * está 100% íntegra, livre de links quebrados (404) ou quebras de JavaScript
 * após qualquer deploy.
 *
 * Execução:
 *   npx playwright test tests/e2e/comportamento-global.spec.ts
 *
 * Para apontar para um ambiente remoto (ex: preview da Vercel):
 *   BASE_URL=https://buscacentral-xxx.vercel.app npx playwright test
 */

// ─── Mapeamento das centrais: rota → h1 esperado ─────────────────────────────
const CENTRAIS = [
  { route: '/documentos', expectedH1: 'Central de Documentos' },
  { route: '/localizacao', expectedH1: 'Central de Localização' },
  { route: '/financeiro', expectedH1: 'Central Financeira' },
  { route: '/utilidades', expectedH1: 'Central de Utilidades' },
] as const;

// ─── Mapeamento dos links institucionais do rodapé ────────────────────────────
const FOOTER_LINKS = [
  { text: 'Sobre Nós', expectedRoute: '/sobre', expectedH1: 'Sobre o BuscaCentral' },
  { text: 'Política de Privacidade', expectedRoute: '/privacidade', expectedH1: 'Política de Privacidade' },
  { text: 'Termos de Uso', expectedRoute: '/termos', expectedH1: 'Termos de Uso' },
] as const;

// ─── Bloco de setup: coleta de erros críticos do console ─────────────────────
let consoleErrors: string[];
let pageErrors: string[];

test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  pageErrors = [];

  // Captura erros críticos de JavaScript (Uncaught Exception)
  page.on('pageerror', (error) => {
    pageErrors.push(`[pageerror] ${error.message}`);
  });

  // Captura erros do console (console.error)
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[console.error] ${msg.text()}`);
    }
  });
});

// ─── 1. VERIFICAÇÃO DE ROTEAMENTO E STATUS DAS CENTRAIS ──────────────────────
test.describe('1. Roteamento e Status das Centrais', () => {
  for (const central of CENTRAIS) {
    test(`${central.route} → status 200 e h1 "${central.expectedH1}"`, async ({ page }) => {
      // Navega e valida status HTTP 200
      const response = await page.goto(central.route);
      expect(response, `Resposta de ${central.route} não deve ser nula`).not.toBeNull();
      expect(response!.status(), `Status HTTP de ${central.route} deve ser 200`).toBe(200);

      // Valida que o h1 correto está visível
      const h1 = page.getByRole('heading', { level: 1, name: central.expectedH1 });
      await expect(h1, `h1 de ${central.route} deve estar visível`).toBeVisible();

      // Valida que não houve erros críticos de JavaScript
      expect(pageErrors, `${central.route} não deve disparar erros de JavaScript`).toHaveLength(0);
    });
  }
});

// ─── 2. TESTE DE NAVEGAÇÃO DO RODAPÉ (FOOTER COMPLIANCE) ─────────────────────
test.describe('2. Navegação do Rodapé (Footer Compliance)', () => {
  for (const link of FOOTER_LINKS) {
    test(`clique em "${link.text}" → navega para ${link.expectedRoute}`, async ({ page }) => {
      // Acessa a homepage como ponto de partida
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Rola até o rodapé para garantir visibilidade
      const footer = page.getByRole('contentinfo');
      await footer.scrollIntoViewIfNeeded();

      // Clica no link institucional pelo texto exato
      const footerLink = footer.getByRole('link', { name: link.text, exact: true });
      await expect(footerLink, `Link "${link.text}" deve existir no rodapé`).toBeVisible();

      // Aguarda a navegação após o clique (Next.js client-side navigation)
      await Promise.all([
        page.waitForURL(`**${link.expectedRoute}**`, { timeout: 10000 }),
        footerLink.click(),
      ]);

      // Valida a URL de destino
      expect(page.url(), `URL deve conter ${link.expectedRoute}`).toContain(link.expectedRoute);

      // Valida que a página carregou corretamente (h1 visível)
      const h1 = page.getByRole('heading', { level: 1, name: link.expectedH1 });
      await expect(h1, `h1 "${link.expectedH1}" deve estar visível`).toBeVisible();

      // Valida que não houve erros críticos
      expect(pageErrors, `Navegação para ${link.expectedRoute} não deve gerar erros`).toHaveLength(0);
    });
  }
});

// ─── 3. DETECÇÃO DE ERROS NO CONSOLE (REGRESSÃO) ────────────────────────────
test.describe('3. Detecção de Erros no Console (Regressão)', () => {
  test('navegação completa pelas centrais sem erros de JavaScript', async ({ page }) => {
    const failedRoutes: string[] = [];

    for (const central of CENTRAIS) {
      // Reseta os arrays de erros antes de cada navegação
      consoleErrors.length = 0;
      pageErrors.length = 0;

      const response = await page.goto(central.route);
      expect(response, `Resposta de ${central.route} não deve ser nula`).not.toBeNull();
      expect(response!.status(), `Status HTTP de ${central.route}`).toBe(200);

      // Aguarda a página estabilizar (carregamento completo)
      await page.waitForLoadState('networkidle');

      // Coleta erros acumulados durante esta navegação
      if (pageErrors.length > 0 || consoleErrors.length > 0) {
        failedRoutes.push(
          `${central.route}:\n` +
          pageErrors.map((e) => `  ${e}`).join('\n') +
          consoleErrors.map((e) => `  ${e}`).join('\n')
        );
      }
    }

    // Se qualquer central gerou erro, o teste falha apontando qual causou a quebra
    expect(
      failedRoutes,
      `As seguintes centrais dispararam erros críticos no console:\n\n${failedRoutes.join('\n\n')}`
    ).toHaveLength(0);
  });

  test('navegação pelos links do rodapé sem erros de JavaScript', async ({ page }) => {
    const failedLinks: string[] = [];

    // Acessa a homepage primeiro
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    for (const link of FOOTER_LINKS) {
      // Reseta os arrays de erros
      consoleErrors.length = 0;
      pageErrors.length = 0;

      // Volta para a homepage
      await page.goto('/');
      const footer = page.getByRole('contentinfo');
      await footer.scrollIntoViewIfNeeded();

      // Clica no link
      const footerLink = footer.getByRole('link', { name: link.text, exact: true });

      // Aguarda a navegação após o clique
      await Promise.all([
        page.waitForURL(`**${link.expectedRoute}**`, { timeout: 10000 }),
        footerLink.click(),
      ]);
      await page.waitForLoadState('networkidle');

      // Coleta erros
      if (pageErrors.length > 0 || consoleErrors.length > 0) {
        failedLinks.push(
          `"${link.text}" (${link.expectedRoute}):\n` +
          pageErrors.map((e) => `  ${e}`).join('\n') +
          consoleErrors.map((e) => `  ${e}`).join('\n')
        );
      }
    }

    expect(
      failedLinks,
      `Os seguintes links do rodapé causaram erros no console:\n\n${failedLinks.join('\n\n')}`
    ).toHaveLength(0);
  });
});
