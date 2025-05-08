import { test, expect } from '@playwright/test'

test.describe('Logout funcionalidad', () => {
  test('debería eliminar la cookie de sesión y redirigir al login', async ({ page }) => {
    // 1. Navegar a la página principal (o una donde se supone que el usuario esté logueado)
    await page.goto('http://localhost:3000')

    // Asegúrate de que la cookie 'session' existe antes de hacer el POST
    const cookiesBeforeLogout = await page.context().cookies()
    const sessionCookieBefore = cookiesBeforeLogout.find(cookie => cookie.name === 'session')
    expect(sessionCookieBefore).toBeDefined()

    // 2. Realizar una solicitud POST a la ruta de logout
    const response = await page.request.post('/api/logout')

    // 3. Verificar que la cookie 'session' ha sido eliminada
    const cookiesAfterLogout = await page.context().cookies()
    const sessionCookieAfter = cookiesAfterLogout.find(cookie => cookie.name === 'session')
    expect(sessionCookieAfter).toBeUndefined()

    // 4. Verificar que la redirección sea a la página de login
    expect(response.status()).toBe(302) // Redirección
    expect(response.headers()['location']).toBe('/login')

    // 5. Verificar que el usuario esté efectivamente en la página de login después de la redirección
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
  })
})
