import { test, expect } from '@playwright/test';

test.describe('Página de Login', () => {
  
  // Test para verificar que los elementos del formulario se rendericen correctamente
  test('debería renderizar el formulario de inicio de sesión', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('http://localhost:3000/login');

    // Verificar que los campos de email y contraseña están presentes
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Verificar que el botón de "Iniciar sesión" está visible y tiene el texto correcto
    const loginButton = page.locator('button:has-text("Iniciar sesión")');
    await expect(loginButton).toBeVisible();
  });

  // Test para el inicio de sesión exitoso con credenciales válidas
  test('debería iniciar sesión con credenciales válidas y redirigir al dashboard', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('http://localhost:3000/login');

    // Ingresar un email y contraseña válidos
    await page.fill('input[type="email"]', 'usuario@ejemplo.com');
    await page.fill('input[type="password"]', 'contraseñaCorrecta');

    // Hacer clic en el botón de inicio de sesión
    const loginButton = page.locator('button:has-text("Iniciar sesión")');
    await loginButton.click();

    // Verificar que el usuario fue redirigido al dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  // Test para el inicio de sesión con credenciales inválidas
  test('debería mostrar error con credenciales incorrectas', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('http://localhost:3000/login');

    // Ingresar un email y contraseña incorrectos
    await page.fill('input[type="email"]', 'usuario@ejemplo.com');
    await page.fill('input[type="password"]', 'contraseñaIncorrecta');

    // Hacer clic en el botón de inicio de sesión
    const loginButton = page.locator('button:has-text("Iniciar sesión")');
    await loginButton.click();

    // Verificar que el mensaje de error es visible
    await expect(page.locator('text=Error al iniciar sesión')).toBeVisible();
    await expect(page.locator('text=Email o contraseña incorrectos')).toBeVisible();
  });

  // Test para verificar la validación de campo de email vacío
  test('debería mostrar error si el email está vacío', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('http://localhost:3000/login');

    // Dejar el campo de email vacío y completar solo la contraseña
    await page.fill('input[type="password"]', 'contraseñaCorrecta');

    // Hacer clic en el botón de inicio de sesión
    const loginButton = page.locator('button:has-text("Iniciar sesión")');
    await loginButton.click();

    // Verificar que se muestra un mensaje de error sobre el email
    await expect(page.locator('text=Ingrese un email válido')).toBeVisible();
  });

  // Test para verificar la validación de campo de contraseña vacío
  test('debería mostrar error si la contraseña está vacía', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('http://localhost:3000/login');

    // Dejar el campo de contraseña vacío y completar solo el email
    await page.fill('input[type="email"]', 'usuario@ejemplo.com');

    // Hacer clic en el botón de inicio de sesión
    const loginButton = page.locator('button:has-text("Iniciar sesión")');
    await loginButton.click();

    // Verificar que se muestra un mensaje de error sobre la contraseña
    await expect(page.locator('text=La contraseña es requerida')).toBeVisible();
  });

  // Test para verificar el enlace de registro
  test('debería redirigir a la página de registro', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('http://localhost:3000/login');

    // Hacer clic en el enlace "Registrarse"
    const registerLink = page.locator('text=Registrarse');
    await registerLink.click();

    // Verificar que la página se redirige a la página de registro
    await expect(page).toHaveURL('/register');
  });
});
