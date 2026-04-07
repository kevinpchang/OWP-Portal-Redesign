import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────
// Functional (E2E) Tests — CertificatesPage
// baseURL is set in playwright.config.js as https://owp-portal-redesign.onrender.com/
// ─────────────────────────────────────────────

const PAGE_PATH = '/certificates'

test.describe('CertificatesPage — Functional Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Set a mock pid in localStorage before navigating
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('pid', '458860'))
    await page.goto(PAGE_PATH)
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle')
  })

  // ── Page Load ─────────────────────────────────────────────────

  test('page loads and displays the Certificates heading', async ({ page }) => {
    await expect(page.locator('h1.courses-header')).toBeVisible()
    await expect(page.locator('h1.courses-header')).toHaveText('Certificates')
  })

  test('page description is visible', async ({ page }) => {
    await expect(page.locator('.page-description')).toContainText('View and download your earned certificates')
  })

  test('search input is visible and accepts text', async ({ page }) => {
    const input = page.locator('input.search-input')
    await expect(input).toBeVisible()
    await input.fill('water')
    await expect(input).toHaveValue('water')
  })

  // ── Account name ──────────────────────────────────────────────

  test('displays logged-in account name after loading', async ({ page }) => {
    await expect(page.locator('text=Loading account')).not.toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Logged in as')).toBeVisible()
  })

  // ── Certificates list ─────────────────────────────────────────

  test('shows loading state briefly then renders certificate list', async ({ page }) => {
    await expect(page.locator('.loading-message')).not.toBeVisible({ timeout: 10000 })
    const items = page.locator('.certificate-item')
    await expect(items.first()).toBeVisible()
  })

  test('each certificate item shows a title', async ({ page }) => {
    await page.waitForSelector('.certificate-item', { timeout: 10000 })
    const firstTitle = page.locator('.cert-title').first()
    await expect(firstTitle).toBeVisible()
    // Just check it's visible — don't check text length since Safari loads slower
    const text = await firstTitle.innerText({ timeout: 10000 })
    expect(text.trim().length).toBeGreaterThan(0)
  })

  test('each certificate item shows meta chips (CEUs, Contact Hours, Grade)', async ({ page }) => {
    await page.waitForSelector('.certificate-item', { timeout: 10000 })
    const chips = page.locator('.meta-chip').first()
    await expect(chips).toBeVisible()
  })

  test('each certificate item has a Download Certificate button', async ({ page }) => {
    await page.waitForSelector('.certificate-item', { timeout: 10000 })
    const btn = page.locator('.download-btn').first()
    await expect(btn).toBeVisible()
    await expect(btn).toBeEnabled()
  })

  // ── Search functionality ──────────────────────────────────────

  test('search filters the certificate list in real time', async ({ page }) => {
    await page.waitForSelector('.certificate-item', { timeout: 10000 })
    const totalBefore = await page.locator('.certificate-item').count()

    await page.locator('input.search-input').fill('advanced')
    await page.waitForTimeout(300)

    const totalAfter = await page.locator('.certificate-item').count()
    expect(totalAfter).toBeGreaterThanOrEqual(0)
    expect(totalAfter).toBeLessThanOrEqual(totalBefore)
  })

  test('shows no-match message when search has no results', async ({ page }) => {
    await page.waitForSelector('.certificate-item', { timeout: 10000 })
    await page.locator('input.search-input').fill('xyznotfoundanywhere')
    await page.waitForTimeout(300)
    await expect(page.locator('.empty-message')).toBeVisible()
  })

  test('clearing search restores the full list', async ({ page }) => {
    await page.waitForSelector('.certificate-item', { timeout: 10000 })
    const countBefore = await page.locator('.certificate-item').count()

    await page.locator('input.search-input').fill('xyznotfoundanywhere')
    await page.waitForTimeout(300)
    await page.locator('input.search-input').fill('')
    await page.waitForTimeout(300)

    const countAfter = await page.locator('.certificate-item').count()
    expect(countAfter).toBe(countBefore)
  })

  // ── Sidebar ───────────────────────────────────────────────────

  test('sidebar Messages card is visible', async ({ page }) => {
    await expect(page.locator('.side-title').filter({ hasText: 'Messages' })).toBeVisible()
  })

  test('sidebar Transcripts card is visible', async ({ page }) => {
    await expect(page.locator('.side-title').filter({ hasText: 'Transcripts' })).toBeVisible()
  })

  test('sidebar Purchase History card is visible', async ({ page }) => {
    await expect(page.locator('.side-title').filter({ hasText: 'Purchase History' })).toBeVisible()
  })

  test('(View all messages) link navigates to /messages', async ({ page }) => {
    // Use .side-footer to be specific — avoids matching navbar links
    await page.locator('.side-footer[href="/messages"]').click()
    await expect(page).toHaveURL(/\/messages/)
  })

  test('(View all purchases) link navigates to /purchase-history', async ({ page }) => {
    // Use .side-footer to be specific — avoids matching navbar links
await page.locator('a.side-footer', { hasText: '(View all purchases)' }).click()
    await expect(page).toHaveURL(/\/purchase-history/)
  })

  // ── Download button interaction ───────────────────────────────

  test('clicking Download Certificate button does not crash the page', async ({ page }) => {
    await page.waitForSelector('.download-btn', { timeout: 10000 })
    const btn = page.locator('.download-btn').first()
    await page.route('**/jspdf**', route => route.abort())
    await btn.click()
    await expect(page.locator('.certificates-page')).toBeVisible()
  })

  // ── Responsive layout ─────────────────────────────────────────

  test('page layout adjusts on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(PAGE_PATH)
    await expect(page.locator('h1.courses-header')).toBeVisible()
    await expect(page.locator('input.search-input')).toBeVisible()
  })

})