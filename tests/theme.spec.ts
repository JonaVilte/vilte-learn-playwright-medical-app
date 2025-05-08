import { test, expect } from '@playwright/test'

test.describe('ThemeProvider con next-themes', () => {

  // Verifica que el tema por defecto sea claro
  test('el tema por defecto debe ser claro', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Verifica que el html tenga la clase 'light' (tema claro)
    const html = page.locator('html')
    await expect(html).toHaveClass(/light/)
  })

  // Verifica que al cambiar el tema a oscuro, se aplica la clase 'dark'
  test('cambia a modo oscuro y se aplica la clase correspondiente', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Simula el cambio de tema a oscuro
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark')  // Establece el tema a oscuro
    })
    
    // Recarga la página para aplicar el nuevo tema
    await page.reload()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  // Verifica que el tema oscuro persiste después de recargar la página
  test('modo oscuro persiste en recarga', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Asegura que el tema oscuro persista
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark')  // Configura el tema a oscuro
    })
    await page.reload()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  // Verifica que el cambio de tema se realiza correctamente en la interfaz de usuario
  test('el tema se puede cambiar dinámicamente', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Asumiendo que el botón o el switch de cambio de tema existe en la interfaz:
    const themeToggleButton = page.locator('#theme-toggle-button')  // Cambia el selector según tu implementación

    // Cambia el tema a oscuro
    await themeToggleButton.click()
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Cambia el tema a claro
    await themeToggleButton.click()
    await expect(html).toHaveClass(/light/)
  })

})
