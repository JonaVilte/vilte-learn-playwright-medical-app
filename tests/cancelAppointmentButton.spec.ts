import { test, expect } from '@playwright/test';

test.describe('Cancelar turno', () => {
  
  test('debería deshabilitar el botón "Cancelar turno" si el turno está dentro de las 24 horas', async ({ page }) => {
    // Navegar a la página donde se renderiza el botón
    await page.goto('http://localhost:3000'); // Ajusta la URL si es necesario

    // Suponiendo que tienes un appointmentId y un turno dentro de las 24 horas
    const appointmentDate = new Date();
    appointmentDate.setHours(appointmentDate.getHours() + 1); // Establece un turno dentro de las 24 horas

    // Verificar que el botón "Cancelar turno" está deshabilitado
    const cancelButton = page.locator('button >> text=Cancelar turno');
    await expect(cancelButton).toBeDisabled();
  });

  test('debería abrir el cuadro de diálogo de confirmación al hacer clic en "Cancelar turno" cuando el turno está fuera de las 24 horas', async ({ page }) => {
    // Navegar a la página donde se renderiza el botón
    await page.goto('http://localhost:3000'); // Ajusta la URL si es necesario

    // Suponiendo que tienes un appointmentId y un turno fuera de las 24 horas
    const appointmentDate = new Date();
    appointmentDate.setHours(appointmentDate.getHours() + 48); // Establece un turno fuera de las 24 horas

    // Verificar que el botón "Cancelar turno" está visible
    const cancelButton = page.locator('button >> text=Cancelar turno');
    await expect(cancelButton).toBeVisible();

    // Hacer clic en el botón de cancelar
    await cancelButton.click();

    // Verificar que el cuadro de diálogo de confirmación está visible
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('text=¿Estás seguro?')).toBeVisible();
  });

  test('debería cancelar el turno y mostrar notificación de éxito al confirmar la cancelación', async ({ page }) => {
    // Navegar a la página donde se renderiza el botón
    await page.goto('http://localhost:3000'); // Ajusta la URL si es necesario

    // Suponiendo que tienes un appointmentId y un turno fuera de las 24 horas
    const appointmentDate = new Date();
    appointmentDate.setHours(appointmentDate.getHours() + 48); // Establece un turno fuera de las 24 horas

    // Hacer clic en el botón de cancelar
    const cancelButton = page.locator('button >> text=Cancelar turno');
    await cancelButton.click();

    // Verificar que el cuadro de diálogo de confirmación está visible
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Hacer clic en el botón de confirmar
    const confirmButton = dialog.locator('button >> text=Confirmar');
    await confirmButton.click();

    // Verificar que el mensaje de éxito (toast) se muestra
    const toastMessage = page.locator('.toast').locator('text=Turno cancelado');
    await expect(toastMessage).toBeVisible();
  });

  test('debería mostrar mensaje de error al intentar cancelar un turno dentro de las 24 horas', async ({ page }) => {
    // Navegar a la página donde se renderiza el botón
    await page.goto('http://localhost:3000'); // Ajusta la URL si es necesario

    // Suponiendo que tienes un appointmentId y un turno dentro de las 24 horas
    const appointmentDate = new Date();
    appointmentDate.setHours(appointmentDate.getHours() + 1); // Establece un turno dentro de las 24 horas

    // Verificar que el botón "Cancelar turno" está deshabilitado
    const cancelButton = page.locator('button >> text=Cancelar turno');
    await expect(cancelButton).toBeDisabled();

    // Verificar que el mensaje de no se puede cancelar está presente
    const cannotCancelMessage = page.locator('button >> text=No se puede cancelar');
    await expect(cannotCancelMessage).toBeVisible();
  });
  
});
