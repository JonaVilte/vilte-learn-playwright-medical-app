import { test, expect } from '@playwright/test';

test.describe('Reservar turno', () => {
  test('debería permitir seleccionar especialidad, médico, fecha y horario, y reservar el turno correctamente', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.getByRole('textbox', { name: 'Email' }).fill('test@correo.com');
    await page.getByRole('textbox', { name: 'Contraseña' }).fill('1234');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // ✅ Esperar un indicador de sesión iniciada (por ejemplo, el heading o navbar)
    await expect(page.getByRole('heading', { name: 'Reservar Turno' })).toBeVisible({ timeout: 10000 });

    // ✅ Verificar que la URL actual contiene /reservar-turno
    await expect(page).toHaveURL(/\/reservar-turno/);

    // 3. Verificar que la página cargó correctamente
    await expect(page.getByRole('heading', { name: 'Reservar Turno' })).toBeVisible();

    // 4. Seleccionar especialidad
    const especialidadSelect = page.getByLabel('Especialidad');
    await expect(especialidadSelect).toBeVisible();
    await especialidadSelect.selectOption('cardiologia');

    // 5. Seleccionar médico
    const medicoSelect = page.getByLabel('Médico');
    await expect(medicoSelect).toBeVisible();
    await medicoSelect.selectOption('dr-juan-perez');

    // 6. Seleccionar fecha
    const fechaInput = page.getByLabel('Fecha');
    await expect(fechaInput).toBeVisible();
    await fechaInput.fill('2025-05-20');

    // 7. Seleccionar horario
    const horarioSelect = page.getByLabel('Horario');
    await expect(horarioSelect).toBeVisible();
    await horarioSelect.selectOption('10:00');

    // 8. Confirmar reserva
    const reservarButton = page.getByRole('button', { name: 'Reservar' });
    await expect(reservarButton).toBeEnabled();
    await reservarButton.click();

    // 9. Verificar mensaje de éxito
    await expect(page.getByText('Turno reservado con éxito')).toBeVisible();
  });
});
