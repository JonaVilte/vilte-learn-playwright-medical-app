import { test, expect } from '@playwright/test';

test('debería renderizar el formulario de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await expect(page.getByRole('textbox', { name: 'Nombre' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Teléfono' })).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

  await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible();
});

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


test('debería registrar correctamente y redirigir al login con mensaje de éxito', async ({ page }) => {
  await page.goto('http://localhost:3000/register');

  await page.getByRole('textbox', { name: 'Nombre' }).fill('Juan Pérez');
  await page.getByRole('textbox', { name: 'Email' }).fill(`juan@ejemplo.com`);
  await page.getByRole('textbox', { name: 'Teléfono' }).fill('123456789');
  await page.locator('input[name="password"]').fill('contraseñaSegura123');
  await page.locator('input[name="confirmPassword"]').fill('contraseñaSegura123');

  await page.getByRole('button', { name: 'Registrarse' }).click();

  // Esperamos redirección al login
  await page.goto('http://localhost:3000/login');
});


