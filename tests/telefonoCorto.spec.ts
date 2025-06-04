import { test, expect } from '@playwright/test';

test('debería mostrar error si el teléfono es corto', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.getByRole('textbox', { name: 'Nombre' }).fill('Juan Pérez');
  await page.getByRole('textbox', { name: 'Email' }).fill('juanperez@ejemplo.com');
  await page.getByRole('textbox', { name: 'Teléfono' }).fill('123');
  await page.locator('input[name="password"]').fill('contraseñaSegura');
  await page.locator('input[name="confirmPassword"]').fill('contraseñaSegura');

  await page.getByRole('button', { name: 'Registrarse' }).click();

  await expect(page.getByText('Ingrese un número de teléfono válido')).toBeVisible();
});
