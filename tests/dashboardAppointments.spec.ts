import { test, expect } from '@playwright/test';


test('debería mostrar la tarjeta del turno correctamente', async ({ page }) => {
  // Ir a la página de login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'test1234');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // Ir al dashboard
  await page.goto('http://localhost:3000/dashboard');

  // Verificar los datos del turno
  const turnoCard = page.locator('div:has-text("Dermatología")');

  await expect(turnoCard).toContainText('Dermatología');
  await expect(turnoCard).toContainText('Dr. María García');
  await expect(turnoCard).toContainText('04/06/2025');
  await expect(turnoCard).toContainText('09:00');

  // Verificar botón "Cancelar turno"
  const cancelButton = turnoCard.getByRole('button', { name: 'Cancelar turno' });
  await expect(cancelButton).toBeVisible();
});
// Test: usuario sin turnos reservados
test('debería mostrar mensaje si no tiene citas', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'testuser@example.com'); // <== cambia esto si es necesario
  await page.fill('input[type="password"]', 'test1234'); // <== cambia esto si es necesario
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await page.goto('http://localhost:3000/dashboard');
  
  await expect(page.getByText('No tienes turnos reservados')).toBeVisible();

});

// Test: cancelar turno
test('debería permitir cancelar un turno', async ({ page }) => {
  await login(page);

  const cancelButton = page.getByRole('button', { name: 'Cancelar turno' });
  await expect(cancelButton).toBeVisible();
  await cancelButton.click();

  await expect(page.getByText('No tienes turnos reservados')).toBeVisible();
});

// Test: redirección a página de reservar turno
test('debería redirigir a la página de reservar turno', async ({ page }) => {
  await login(page);

  const reserveButton = page.getByRole('button', { name: 'Reservar nuevo turno' });
  await reserveButton.click();

  await expect(page).toHaveURL('/dashboard/reservar');
});
