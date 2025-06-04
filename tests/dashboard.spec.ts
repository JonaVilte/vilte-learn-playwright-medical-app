import { test, expect } from '@playwright/test';

// Test para asegurar que un usuario autenticado puede ver el dashboard
test('debería mostrar el dashboard correctamente para usuarios autenticados', async ({ page }) => {
  await page.goto('http://localhost:3000/login');

  await page.fill('input[type="email"]', 'testuser@example.com');
  await page.fill('input[type="password"]', 'test1234');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await page.goto('http://localhost:3000/dashboard');

  page.getByText('Hola, Test User');
  await expect(page.getByText('MediCitas')).toBeVisible();

});

// Test para verificar que si no está autenticado, el usuario sea redirigido a login
test('debería redirigir a login si el usuario no está autenticado', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');

  // Verificar que la página redirige a login
  await expect(page).toHaveURL('/login');
});


