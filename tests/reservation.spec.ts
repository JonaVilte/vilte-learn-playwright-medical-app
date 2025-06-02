import { test, expect } from '@playwright/test';

test('debería permitir seleccionar especialidad, médico, fecha y horario, y reservar el turno correctamente', async ({ page }) => {
  // Interceptar la solicitud POST a la API de turnos
  let requestBody: any = null;
  await page.route('**/api/appointments', async (route, request) => {
    if (request.method() === 'POST') {
      requestBody = JSON.parse(request.postData() || '{}');
    }
    await route.continue();
  });

  // Navegar a la página de reserva
  await page.goto('http://localhost:3001/dashboard/reservar');

  // Verificar que la página se haya cargado

  // Seleccionar una especialidad
  const specialtySelect = page.getByRole('combobox', { name: 'Registrarse' });

  await specialtySelect.selectOption({ index: 0 });

  // Esperar a que los médicos se carguen y seleccionar uno
  const doctorsSelect = page.locator('select[name="doctorId"]');
  await expect(doctorsSelect.locator('option')).toHaveCount(3); // opciones, no el select
  await doctorsSelect.selectOption({ index: 0 });

  // Seleccionar una fecha
  const dateButton = page.locator('button[aria-label="Selecciona una fecha"]');
  await dateButton.click();
  await page.locator('td[aria-label="16 de Mayo de 2025"]').click();

  // Verificar horarios y seleccionar uno
  const timeSlotsSelect = page.locator('select[name="timeSlot"]');
  await expect(timeSlotsSelect.locator('option')).toHaveCount(5);
  await timeSlotsSelect.selectOption({ index: 0 });

  // Enviar el formulario
  const submitButton = page.locator('button[type="submit"]');
  await Promise.all([
    page.waitForNavigation({ url: '**/dashboard' }),
    submitButton.click()
  ]);

  // Verificar redirección y mensaje de éxito
  await expect(page).toHaveURL('http://localhost:3001/dashboard');
  await expect(page.locator('h1')).toHaveText('Turno reservado');

  // Verificar que la solicitud se envió con los datos correctos
  expect(requestBody).toMatchObject({
    specialty: 'Cardiología',
    doctorId: 'doctor-id-1',
    date: '2025-05-16',
    timeSlot: '10:00 AM',
  });
});
