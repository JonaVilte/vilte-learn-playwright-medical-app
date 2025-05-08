import { test, expect } from '@playwright/test';

test.describe('Página de inicio', () => {
  
  // Test para verificar los enlaces de "Iniciar sesión" y "Registrarse"
  test('deberían estar presentes los botones de "Iniciar sesión" y "Registrarse"', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');
    
    // Verificar que el botón "Iniciar sesión" esté visible y sea un enlace
    const loginButton = page.locator('a[href="/login"] >> text=Iniciar Sesión');
    await expect(loginButton).toBeVisible();

    // Verificar que el botón "Registrarse" esté visible y sea un enlace
    const registerButton = page.locator('a[href="/register"] >> text=Registrarse');
    await expect(registerButton).toBeVisible();
  });

  // Test para verificar que el botón "Comenzar ahora" redirige correctamente
  test('debería redirigir a la página de registro al hacer clic en "Comenzar ahora"', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');
    
    // Verificar que el botón "Comenzar ahora" esté visible
    const startButton = page.locator('button >> text=Comenzar ahora');
    await expect(startButton).toBeVisible();

    // Hacer clic en el botón "Comenzar ahora"
    await startButton.click();

    // Verificar que la redirección ocurrió a la página de registro
    await expect(page).toHaveURL('http://localhost:3000/register');
  });

  // Test para verificar que las tres secciones "¿Cómo funciona?" están visibles
  test('deberían estar presentes las secciones "1. Regístrate", "2. Reserva" y "3. Confirma"', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');
    
    // Verificar que las tres secciones están presentes y visibles
    const registerSection = page.locator('text=1. Regístrate');
    const reserveSection = page.locator('text=2. Reserva');
    const confirmSection = page.locator('text=3. Confirma');
    
    await expect(registerSection).toBeVisible();
    await expect(reserveSection).toBeVisible();
    await expect(confirmSection).toBeVisible();
  });

  // Test para verificar que el pie de página tiene el texto correcto
  test('debería mostrar el pie de página con el texto de derechos reservados', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://localhost:3000');
    
    // Verificar que el pie de página tiene el texto correcto
    const footerText = page.locator('footer text=© 2025 MediCitas. Todos los derechos reservados.');
    await expect(footerText).toBeVisible();
  });
  
});
