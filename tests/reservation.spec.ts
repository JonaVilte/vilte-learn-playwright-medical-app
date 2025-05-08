import { test, expect } from '@playwright/test';

test.describe('Reservar turno', () => {
  test('debería permitir seleccionar especialidad, médico, fecha y horario, y reservar el turno correctamente', async ({ page }) => {
    // Navegar a la página de reserva
    await page.goto('http://localhost:3000/reservar-turno');
    
    // 1. Verificar que la página se haya cargado
    const title = await page.locator('h1'); // O el selector que contiene el texto
    await expect(title).toHaveText('Reservar Turno');
    
    // 2. Seleccionar una especialidad
    const specialtySelect = await page.locator('select[name="specialty"]');
    await specialtySelect.selectOption({ index: 0 }); // Seleccionar la primera especialidad
    
    // 3. Verificar que los médicos se cargaron correctamente después de seleccionar la especialidad
    const doctorsSelect = await page.locator('select[name="doctorId"]');
    await expect(doctorsSelect).toHaveCount(3); // Asumiendo que hay 3 médicos disponibles para la especialidad
    
    // 4. Seleccionar un médico
    await doctorsSelect.selectOption({ index: 0 }); // Seleccionar el primer médico
    
    // 5. Seleccionar una fecha
    const dateButton = await page.locator('button[aria-label="Selecciona una fecha"]');
    await dateButton.click(); // Abrir el calendario
    await page.locator('td[aria-label="16 de Mayo de 2025"]').click(); // Seleccionar una fecha específica (ej. 16 de Mayo de 2025)
    
    // 6. Verificar que los horarios disponibles se han cargado correctamente
    const timeSlotsSelect = await page.locator('select[name="timeSlot"]');
    await expect(timeSlotsSelect).toHaveCount(5); // Asumiendo que hay 5 horarios disponibles
    
    // 7. Seleccionar un horario
    await timeSlotsSelect.selectOption({ index: 0 }); // Seleccionar el primer horario
    
    // 8. Enviar el formulario
    const submitButton = await page.locator('button[type="submit"]');
    await submitButton.click();
    
    // 9. Verificar que el formulario ha sido enviado y el usuario ha sido redirigido a la página de dashboard
    await expect(page).toHaveURL('/dashboard');
    const dashboardText = await page.locator('h1'); // O el selector que contiene el texto
    await expect(dashboardText).toHaveText('Turno reservado');
    
    // 10. Verificar que la API haya sido llamada con los datos correctos
    const requestData = {
      specialty: 'Cardiología',
      doctorId: 'doctor-id-1',
      date: '2025-05-16',
      timeSlot: '10:00 AM',
    };

    // Interceptar la solicitud POST y verificar los datos enviados
    page.on('route', (route) => {
      // Asegúrate de que el request sea POST y tenga la URL correcta
      if (route.request().method() === 'POST' && route.request().url() === '/api/appointments') {
        const requestBody = route.request().postDataJSON();
        expect(requestBody).toEqual(requestData);
        route.continue(); // Deja que la solicitud siga adelante
      } else {
        route.continue(); // Asegura que otras solicitudes también se manejen
      }
    });
  });
});
