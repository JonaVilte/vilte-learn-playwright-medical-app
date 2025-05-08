import { test, expect } from '@playwright/test';

test.describe('Dashboard - Mis Turnos', () => {
  
  // Test para cuando el usuario tiene turnos reservados
  test('debería mostrar los turnos del usuario si tiene citas', async ({ page }) => {
    // Simular que el usuario está autenticado y tiene citas
    await page.context().addCookies([{
      name: 'session',
      value: 'valid-session-token', // Sustituir por un token válido de sesión
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
    }]);

    // Mock de los turnos
    await page.route('**/api/appointments', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            specialty: 'Cardiología',
            doctorName: 'Dr. Pérez',
            date: '2025-05-10',
            time: '10:00 AM',
          },
          {
            id: '2',
            specialty: 'Dermatología',
            doctorName: 'Dr. Gómez',
            date: '2025-05-12',
            time: '2:00 PM',
          }
        ]),
      });
    });

    // Navegar al dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Verificar que los turnos se muestran
    await expect(page.locator('h1:text("Mis Turnos")')).toBeVisible();
    await expect(page.locator('.text-lg')).toContainText('Cardiología');
    await expect(page.locator('.text-lg')).toContainText('Dermatología');
    await expect(page.locator('.text-sm')).toContainText('10:00 AM');
    await expect(page.locator('.text-sm')).toContainText('2:00 PM');

    // Verificar que el botón de cancelación de turno está presente
    const cancelButton = page.locator('button:has-text("Cancelar turno")');
    await expect(cancelButton).toBeVisible();
  });

  // Test para cuando el usuario no tiene turnos reservados
  test('debería mostrar mensaje de no hay turnos si no tiene citas', async ({ page }) => {
    // Simular que el usuario está autenticado y no tiene citas
    await page.context().addCookies([{
      name: 'session',
      value: 'valid-session-token', 
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
    }]);

    // Mock de la respuesta vacía de citas
    await page.route('**/api/appointments', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      });
    });

    // Navegar al dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Verificar que el mensaje de no tener turnos esté visible
    await expect(page.locator('p:text("No tienes turnos reservados")')).toBeVisible();

    // Verificar que el botón de reservar un turno está visible
    const reserveButton = page.locator('button:has-text("Reservar un turno")');
    await expect(reserveButton).toBeVisible();
  });

  // Test para verificar la funcionalidad de cancelar un turno
  test('debería permitir cancelar un turno', async ({ page }) => {
    // Simular que el usuario está autenticado y tiene citas
    await page.context().addCookies([{
      name: 'session',
      value: 'valid-session-token', 
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
    }]);

    // Mock de los turnos
    await page.route('**/api/appointments', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            specialty: 'Cardiología',
            doctorName: 'Dr. Pérez',
            date: '2025-05-10',
            time: '10:00 AM',
          }
        ]),
      });
    });

    // Navegar al dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Verificar que el botón de cancelación esté visible
    const cancelButton = page.locator('button:has-text("Cancelar turno")');
    await expect(cancelButton).toBeVisible();

    // Simular la cancelación del turno
    await cancelButton.click();

    // Verificar que la cita haya sido eliminada (asumimos que se actualiza la UI)
    await expect(page.locator('.text-gray-500')).toHaveText('No tienes turnos reservados');
  });

  // Test para verificar que la página de reservar turno se carga correctamente
  test('debería redirigir a la página de reservar turno', async ({ page }) => {
    // Navegar al dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Hacer clic en el botón "Reservar nuevo turno"
    const reserveButton = page.locator('button:has-text("Reservar nuevo turno")');
    await reserveButton.click();

    // Verificar que se redirige a la página de reserva
    await expect(page).toHaveURL('/dashboard/reservar');
  });
});
