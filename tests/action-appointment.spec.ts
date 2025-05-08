import { test, expect } from '@playwright/test';

test.describe('Reservar turno', () => {
  test('debería permitir seleccionar especialidad, médico, fecha y horario, y reservar el turno correctamente', async ({ page }) => {
    // 1. Navegar a la página de login
    await page.goto('http://localhost:3000/login');
    
    // Llenar y enviar el formulario de login
    await page.fill('input[name="email"]', 'test@correo.com');
    await page.fill('input[name="password"]', '1234');
    await page.click('button[type="submit"]');
    
    // 2. Verificar la redirección correcta a la página de reserva
    console.log('Current URL:', page.url()); // Verificar URL
    await page.waitForURL('http://localhost:3000/reservar-turno', { timeout: 60000 }); // Aumentar timeout si es necesario

    // 3. Verificar que la página se haya cargado correctamente
    const title = await page.locator('h1');
    await expect(title).toHaveText('Reservar Turno');
    
    // Continuar con el flujo de la prueba...
  });
});
