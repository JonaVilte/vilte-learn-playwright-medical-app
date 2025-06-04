import { test, expect } from '@playwright/test';

test('debería renderizar el formulario de inicio de sesión', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();

  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
  await expect(loginButton).toBeVisible();
});

test('debería iniciar sesión con credenciales válidas y redirigir al dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[type="email"]', 'testuser@example.com');
  await page.fill('input[type="password"]', 'test1234');

  const regisButton = page.getByRole('button', { name: 'Iniciar sesión' });
  await expect(regisButton).toBeVisible();
  await regisButton.click();
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
});

test('debería redirigir a la página de registro', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  const registerLink = page.getByRole('link', { name: 'Registrarse' });
  await expect(registerLink).toBeVisible();
  await registerLink.click();
  await expect(page).toHaveURL('http://localhost:3000/register');
});
