import { test, expect } from '@playwright/test'

test.describe('Purchase History functional tests', () => {
  test('loads purchase history list', async ({ page }) => {
    await page.goto('/purchase-history')

    await expect(page.locator('h1.page-title')).toHaveText('Purchase History')
    await expect(page.locator('.inv-card').first()).toBeVisible()
  })

  test('clicking invoice opens detail view', async ({ page }) => {
    await page.goto('/purchase-history')

    const firstCard = page.locator('.inv-card').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()

    await expect(page).toHaveURL(/\/purchase-history\/\d+/)
    await expect(page.getByText('Invoice Details')).toBeVisible()
    await expect(page.locator('.detail-table')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Receipt' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Return to Purchase History' })
    ).toBeVisible()
  })

  test('return button goes back to list page', async ({ page }) => {
    await page.goto('/purchase-history')

    const firstCard = page.locator('.inv-card').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()

    const returnButton = page.getByRole('button', {
      name: 'Return to Purchase History'
    })
    await expect(returnButton).toBeVisible()
    await returnButton.click()

    await expect(page).toHaveURL(/\/purchase-history$/)
    await expect(page.locator('.inv-card').first()).toBeVisible()
  })
})