import { test, expect } from '@playwright/test';

test.describe('Dashboard Layout', () => {
  // Test para asegurar que un usuario autenticado puede ver el dashboard
  test('debería mostrar el dashboard correctamente para usuarios autenticados', async ({ page }) => {
    // Suponemos que el usuario está autenticado de alguna manera, por ejemplo, estableciendo cookies de sesión
    await page.context().addCookies([{
      name: 'session',
      value: 'valid-session-token', // Sustituir por un token válido de sesión
      domain: 'localhost', // O el dominio de tu app
      path: '/',
      httpOnly: true,
      secure: false,
    }]);

    // Navegar al dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Verificar que el header contiene el nombre del usuario
    await expect(page.locator('span:text("Hola,")')).toHaveText(/Hola, \w+/);

    // Verificar que el nombre de la app está presente
    await expect(page.locator('span.text-xl.font-bold.text-teal-600')).toHaveText('MediCitas');

    // Verificar que el botón de logout está presente
    const logoutButton = await page.locator('button[type="submit"]');
    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toHaveText('Salir');
  });

  // Test para verificar que si no está autenticado, el usuario sea redirigido a login
  test('debería redirigir a login si el usuario no está autenticado', async ({ page }) => {
    // Navegar al dashboard sin autenticación
    await page.goto('http://localhost:3000/dashboard');

    // Verificar que la página redirige a login
    await expect(page).toHaveURL('/login');
  });

  // Test para verificar que los enlaces en el sidebar funcionan correctamente
  test('debería permitir navegar entre las páginas desde el sidebar', async ({ page }) => {
    // Suponemos que el usuario está autenticado
    await page.context().addCookies([{
      name: 'session',
      value: 'valid-session-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
    }]);

    // Navegar al dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Verificar que el enlace "Mis Turnos" funciona
    await page.locator('a[href="/dashboard"]').click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toHaveText('Mis Turnos');

    // Verificar que el enlace "Reservar Turno" funciona
    await page.locator('a[href="/dashboard/reservar"]').click();
    await expect(page).toHaveURL('/dashboard/reservar');
    await expect(page.locator('h1')).toHaveText('Reservar Turno');

    // Verificar que el enlace "Mi Perfil" funciona
    await page.locator('a[href="/dashboard/perfil"]').click();
    await expect(page).toHaveURL('/dashboard/perfil');
    await expect(page.locator('h1')).toHaveText('Mi Perfil');
  });
});
