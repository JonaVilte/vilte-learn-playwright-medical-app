import { test, expect } from '@playwright/test';

test.describe('Página de Registro', () => {

  // Test para verificar que los elementos del formulario se rendericen correctamente
  test('debería renderizar el formulario de registro', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/register');

    // Verificar que los campos del formulario están presentes
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();

    // Verificar que el botón de "Registrarse" está visible y tiene el texto correcto
    const registerButton = page.locator('button:has-text("Registrarse")');
    await expect(registerButton).toBeVisible();
  });

  // Test para verificar que se puede registrar con datos válidos
  test('debería registrar al usuario con datos válidos', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/register');

    // Ingresar datos válidos en el formulario
    await page.fill('input[name="name"]', 'Juan Pérez');
    await page.fill('input[type="email"]', 'juanperez@ejemplo.com');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[type="password"]', 'contraseñaSegura');
    await page.fill('input[name="confirmPassword"]', 'contraseñaSegura');

    // Hacer clic en el botón de registro
    const registerButton = page.locator('button:has-text("Registrarse")');
    await registerButton.click();

    // Verificar que se ha mostrado un mensaje de éxito (después de redirigir al login)
    await expect(page.locator('text=Registro exitoso')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  // Test para verificar la validación de nombre vacío
  test('debería mostrar error si el nombre está vacío', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/register');

    // Dejar el campo de nombre vacío y completar los demás campos
    await page.fill('input[type="email"]', 'juanperez@ejemplo.com');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[type="password"]', 'contraseñaSegura');
    await page.fill('input[name="confirmPassword"]', 'contraseñaSegura');

    // Hacer clic en el botón de registro
    const registerButton = page.locator('button:has-text("Registrarse")');
    await registerButton.click();

    // Verificar que se muestra un mensaje de error sobre el nombre
    await expect(page.locator('text=El nombre debe tener al menos 2 caracteres')).toBeVisible();
  });

  // Test para verificar la validación de email inválido
  test('debería mostrar error si el email es inválido', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/register');

    // Ingresar un email inválido
    await page.fill('input[name="name"]', 'Juan Pérez');
    await page.fill('input[type="email"]', 'juanperez@ejemplo');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[type="password"]', 'contraseñaSegura');
    await page.fill('input[name="confirmPassword"]', 'contraseñaSegura');

    // Hacer clic en el botón de registro
    const registerButton = page.locator('button:has-text("Registrarse")');
    await registerButton.click();

    // Verificar que se muestra un mensaje de error sobre el email
    await expect(page.locator('text=Ingrese un email válido')).toBeVisible();
  });

  // Test para verificar la validación de teléfono corto
  test('debería mostrar error si el teléfono es corto', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/register');

    // Ingresar un teléfono corto
    await page.fill('input[name="name"]', 'Juan Pérez');
    await page.fill('input[type="email"]', 'juanperez@ejemplo.com');
    await page.fill('input[name="phone"]', '123');
    await page.fill('input[type="password"]', 'contraseñaSegura');
    await page.fill('input[name="confirmPassword"]', 'contraseñaSegura');

    // Hacer clic en el botón de registro
    const registerButton = page.locator('button:has-text("Registrarse")');
    await registerButton.click();

    // Verificar que se muestra un mensaje de error sobre el teléfono
    await expect(page.locator('text=Ingrese un número de teléfono válido')).toBeVisible();
  });

  // Test para verificar la validación de contraseñas no coincidentes
  test('debería mostrar error si las contraseñas no coinciden', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/register');

    // Ingresar contraseñas que no coinciden
    await page.fill('input[name="name"]', 'Juan Pérez');
    await page.fill('input[type="email"]', 'juanperez@ejemplo.com');
    await page.fill('input[name="phone"]', '123456789');
    await page.fill('input[type="password"]', 'contraseñaSegura');
    await page.fill('input[name="confirmPassword"]', 'otraContraseña');

    // Hacer clic en el botón de registro
    const registerButton = page.locator('button:has-text("Registrarse")');
    await registerButton.click();

    // Verificar que se muestra un mensaje de error sobre las contraseñas no coincidentes
    await expect(page.locator('text=Las contraseñas no coinciden')).toBeVisible();
  });

  // Test para verificar la redirección al login si ya tiene cuenta
  test('debería redirigir a la página de login si ya tiene cuenta', async ({ page }) => {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/register');

    // Hacer clic en el enlace "Iniciar sesión"
    const loginLink = page.locator('text=Iniciar sesión');
    await loginLink.click();

    // Verificar que la página se redirige a la página de login
    await expect(page).toHaveURL('/login');
  });
});
