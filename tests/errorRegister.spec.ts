import { test, expect } from '@playwright/test';

test('debería mostrar error si el nombre está vacío', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.getByRole('textbox', { name: 'Email' }).fill('juanperez@ejemplo.com');
  await page.getByRole('textbox', { name: 'Teléfono' }).fill('123456789');
  await page.locator('input[name="password"]').fill('contraseñaSegura');
  await page.locator('input[name="confirmPassword"]').fill('contraseñaSegura');

  await page.getByRole('button', { name: 'Registrarse' }).click();

  await expect(page.getByText('El nombre debe tener al menos 2 caracteres')).toBeVisible();
});

test('debería mostrar error si el email es inválido', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.getByRole('textbox', { name: 'Nombre' }).fill('Juan Pérez');
  await page.getByRole('textbox', { name: 'Email' }).fill('juanperez@ejemplo');
  await page.getByRole('textbox', { name: 'Teléfono' }).fill('123456789');
  await page.locator('input[name="password"]').fill('contraseñaSegura');
  await page.locator('input[name="confirmPassword"]').fill('contraseñaSegura');

  await page.getByRole('button', { name: 'Registrarse' }).click();

  await expect(page.getByText('Ingrese un email válido')).toBeVisible();
});

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

test('debería mostrar error si las contraseñas no coinciden', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.getByRole('textbox', { name: 'Nombre' }).fill('Juan Pérez');
  await page.getByRole('textbox', { name: 'Email' }).fill('juanperez@ejemplo.com');
  await page.getByRole('textbox', { name: 'Teléfono' }).fill('123456789');
  await page.locator('input[name="password"]').fill('contraseñaSegura');
  await page.locator('input[name="confirmPassword"]').fill('otraContraseña');

  await page.getByRole('button', { name: 'Registrarse' }).click();

  await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible();
});