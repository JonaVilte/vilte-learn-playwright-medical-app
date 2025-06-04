import { test, expect } from '@playwright/test';

test('debería mostrar error si el email está vacío', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[type="password"]', 'contraseñaCorrecta');

  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('Ingrese un email válido')).toBeVisible();
});

test('debería mostrar error si la contraseña está vacía', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[type="email"]', 'testuser@example.com');

  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('La contraseña es requerida')).toBeVisible();
});