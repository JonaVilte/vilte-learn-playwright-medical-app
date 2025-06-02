import { test, expect } from '@playwright/test';

// Test para verificar que existe un botón con el texto "Iniciar sesión"
test('debería existir un botón con el texto "Iniciar sesión"', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

// Test para verificar que existe un botón con el texto "Registrarse"
test('debería existir un botón con el texto "Registrarse"', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const registerButton = page.getByRole('button', { name: 'Registrarse' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page).toHaveURL('http://localhost:3000/register');
});

// Test para verificar que el botón "Comenzar ahora" redirige correctamente
test('debería redirigir al registro al hacer clic en el botón "Comenzar ahora"', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const startButton = page.getByRole('button', { name: 'Comenzar ahora' });
  await expect(startButton).toBeVisible();
  await startButton.click();
  await expect(page).toHaveURL('http://localhost:3000/register');
});

// Test para verificar que los textos de las secciones están visibles
test('deberían estar visibles los textos "1. Regístrate", "2. Reserva" y "3. Confirma"', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.getByText('1. Regístrate')).toBeVisible();
  await expect(page.getByText('2. Reserva')).toBeVisible();
  await expect(page.getByText('3. Confirma')).toBeVisible();
});
