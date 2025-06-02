import { test, expect } from '@playwright/test';

test.describe('Root Layout', () => {

  // Test para verificar que el tema predeterminado es 'light'
  test('debería aplicar el tema claro por defecto', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');

    // Verificar que la clase 'light' está presente en el elemento <html>
    const htmlElement = await page.locator('html');
    await expect(htmlElement).toHaveClass(/light/);

    // Verificar que el esquema de color es 'light'
    const bodyElement = await page.locator('body');
    const colorScheme = await bodyElement.evaluate(el => getComputedStyle(el).colorScheme);
    expect(colorScheme).toBe('light');
  });

  // Test para verificar que la fuente Inter está siendo utilizada
  test('debería usar la fuente Inter', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');

    // Verificar que la fuente Inter se aplica al texto
    const bodyText = await page.locator('body');
    const fontFamily = await bodyText.evaluate(el => getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain('Inter');
  });

  // Test para verificar que el contenido del cuerpo se renderiza correctamente
  test('debería renderizar el contenido del cuerpo correctamente', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');

    // Verificar que el contenido principal (children) se ha renderizado
    const headerText = await page.locator('header').textContent();
    expect(headerText).toBeTruthy();

    const mainContent = await page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  // Test para verificar que el tema puede ser cambiado (si el mecanismo está implementado)
  test('debería cambiar al tema oscuro al seleccionar una opción', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');

    // Suponiendo que haya un botón para cambiar el tema
    const themeToggleButton = page.locator('button[aria-label="Toggle theme"]');
    
    // Cambiar al tema oscuro
    await themeToggleButton.click();

    // Verificar que el tema 'dark' se ha aplicado
    const htmlElement = await page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);

    // Verificar que el esquema de color es 'dark'
    const bodyElement = await page.locator('body');
    const colorScheme = await bodyElement.evaluate(el => getComputedStyle(el).colorScheme);
    expect(colorScheme).toBe('dark');
  });

});
