import { test, expect } from '@playwright/test'

test.describe('Logout funcionalidad', () => {
  test('debería eliminar la cookie de sesión y redirigir al login', async ({ page }) => {
    // 1. Navegar a una página autenticada
    await page.goto('http://localhost:3000')

    // Verificar que existe la cookie de sesión
    const cookiesBefore = await page.context().cookies()
    const sessionCookie = cookiesBefore.find(c => c.name === 'session')
    expect(sessionCookie).toBeDefined()

    // 2. Hacer clic en el botón de logout (ajusta el selector si es necesario)
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()

    // 3. Verificar que estamos en la página de login
    await expect(page).toHaveURL(/\/login/)

    // 4. Confirmar que la cookie fue eliminada
    const cookiesAfter = await page.context().cookies()
    const sessionAfter = cookiesAfter.find(c => c.name === 'session')
    expect(sessionAfter).toBeUndefined()
  })
})
