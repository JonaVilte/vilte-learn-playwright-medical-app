import { test, expect } from '@playwright/test';

test('debería permitir seleccionar especialidad, médico, fecha y horario, y reservar el turno correctamente', async ({ page }) => {
  // Navegar a la página de reserva
  await page.goto('http://localhost:3000/dashboard/reservar');

  // Verificar que la página cargó correctamente (puede ser un título o campo clave visible)
  await expect(page.getByText('Datos del turno')).toBeVisible();

  // Seleccionar una especialidad
  const specialtySelect = page.locator('select[name="specialtyId"]');
  await expect(specialtySelect).toBeVisible();
  await specialtySelect.selectOption({ index: 0 });

  // Esperar a que se carguen los médicos y seleccionar uno
  const doctorsSelect = page.locator('select[name="doctorId"]');
  await expect(doctorsSelect.locator('option')).toHaveCount(3);
  await doctorsSelect.selectOption({ index: 0 });

  // Seleccionar una fecha
  const dateButton = page.locator('button[aria-label="Selecciona una fecha"]');
  await dateButton.click();
  await page.locator('td[aria-label="16 de Mayo de 2025"]').click();

  // Verificar que se cargan horarios y seleccionar uno
  const timeSlotsSelect = page.locator('select[name="timeSlot"]');
  await expect(timeSlotsSelect.locator('option')).toHaveCount(5);
  await timeSlotsSelect.selectOption({ index: 0 });

  // Confirmar la reserva (suponiendo que hay un botón)
  const reservarBtn = page.getByRole('button', { name: 'Reservar' });
  await reservarBtn.click();

  // Esperar redirección y confirmar mensaje de éxito
  await page.waitForURL('http://localhost:3001/dashboard');
  await expect(page.locator('h1')).toHaveText('Turno reservado');
});
