import { test, expect } from '@playwright/test';

test('debería mostrar error con credenciales incorrectas', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'test8765');

  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible();
});