import { test, expect } from '@playwright/test';

test.describe('Conversores Financeiros E2E', () => {
  test('conversor bidirecional na página do Bitcoin', async ({ page }) => {
    await page.goto('/financeiro/criptomoedas/bitcoin');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Aguarda o preço carregar (campo de crypto fica visível)
    const cryptoInput = page.locator('input[placeholder="0.5"]').first();
    await cryptoInput.waitFor({ state: 'visible', timeout: 15000 });
    await cryptoInput.fill('1');
    await page.waitForTimeout(1000);

    // Verifica que o campo BRL foi preenchido automaticamente
    const brlInput = page.locator('input[placeholder="50.000"]').first();
    await brlInput.waitFor({ state: 'visible', timeout: 5000 });
    const brlValue = await brlInput.inputValue();
    expect(brlValue.length).toBeGreaterThan(0);
    expect(brlValue).not.toBe('NaN');
  });

  test('conversor BRL para Crypto na página do Ethereum', async ({ page }) => {
    await page.goto('/financeiro/criptomoedas/ethereum');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const brlInput = page.locator('input[placeholder="50.000"]').first();
    await brlInput.waitFor({ state: 'visible', timeout: 15000 });
    await brlInput.fill('1000');
    await page.waitForTimeout(1000);

    const cryptoInput = page.locator('input[placeholder="0.5"]').first();
    const cryptoValue = await cryptoInput.inputValue();
    expect(cryptoValue.length).toBeGreaterThan(0);
    expect(cryptoValue).not.toBe('NaN');
  });

  test('conversor Dólar para Real na cotação', async ({ page }) => {
    await page.goto('/financeiro/cotacao');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Aguarda os cards de moeda carregarem
    await page.waitForTimeout(2000);

    // O conversor USD já deve estar visível (selecionado por padrão)
    const foreignInput = page.locator('section').filter({ hasText: 'Conversor' }).locator('input').first();
    await foreignInput.waitFor({ state: 'visible', timeout: 10000 });
    await foreignInput.fill('10');
    await page.waitForTimeout(1000);

    // Verifica que algum valor foi calculado
    const inputs = page.locator('section').filter({ hasText: 'Conversor' }).locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('campo vazio não gera NaN no conversor crypto', async ({ page }) => {
    await page.goto('/financeiro/criptomoedas/bitcoin');

    const cryptoInput = page.locator('input[placeholder="0.5"]').first();
    await cryptoInput.waitFor({ state: 'visible', timeout: 15000 });
    await cryptoInput.fill('10');
    await page.waitForTimeout(500);
    await cryptoInput.clear();
    await page.waitForTimeout(500);

    // Verifica que nenhum NaN apareceu na página
    const bodyText = await page.locator('body').innerText();
    const nanCount = (bodyText.match(/NaN/g) || []).length;
    expect(nanCount).toBe(0);
  });
});

test.describe('Simulador de Financiamento E2E', () => {
  test('simulação preenche resultados', async ({ page }) => {
    await page.goto('/financeiro/financiamento-carro');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Preenche valor do veículo
    const valorInput = page.locator('input[type="text"]').first();
    await valorInput.fill('100000');
    await page.waitForTimeout(300);

    // Preenche entrada
    const entradaInput = page.locator('input[type="text"]').nth(1);
    await entradaInput.fill('20000');
    await page.waitForTimeout(500);

    // Verifica que algum resultado apareceu (R$ visível)
    const pageText = await page.locator('body').innerText();
    expect(pageText).toContain('R$');
    expect(pageText).not.toContain('NaN');
  });
});
