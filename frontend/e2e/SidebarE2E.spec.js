// This file contains end-to-end tests for the Sidebar using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/SidebarE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Sidebar loads all navigation buttons correctly', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.sidebar')).toBeVisible()

  await expect(page.locator('.dashboard-button')).toBeVisible()
  await expect(page.locator('.my-account-button')).toBeVisible()
  await expect(page.locator('.my-tasks-button')).toBeVisible()
  await expect(page.locator('.slides-button')).toBeVisible()
  await expect(page.locator('.media-button')).toBeVisible()
  await expect(page.locator('.courses-button')).toBeVisible()
  await expect(page.locator('.operator-numbers-button')).toBeVisible()
  await expect(page.locator('.certificates-button')).toBeVisible()
  await expect(page.locator('.purchase-history-button')).toBeVisible()
  await expect(page.locator('.logout-button')).toBeVisible()
})

test('Sidebar buttons display the correct text', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.dashboard-button')).toContainText('Dashboard')
  await expect(page.locator('.my-account-button')).toContainText('My Account')
  await expect(page.locator('.my-tasks-button')).toContainText('My Tasks')
  await expect(page.locator('.slides-button')).toContainText('Slides')
  await expect(page.locator('.media-button')).toContainText('Media')
  await expect(page.locator('.courses-button')).toContainText('Courses')
  await expect(page.locator('.operator-numbers-button')).toContainText('Operator Numbers')
  await expect(page.locator('.certificates-button')).toContainText('Certificates')
  await expect(page.locator('.purchase-history-button')).toContainText('Purchase History')
  await expect(page.locator('.logout-button')).toContainText('Logout')
})

test('Clicking Dashboard routes to the dashboard page', async ({ page }) => {
  await page.goto('/courses')

  await page.locator('.dashboard-button').click()
  await expect(page).toHaveURL('/')
})

test('Clicking My Account routes to the My Account page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.my-account-button').click()
  await expect(page).toHaveURL(/\/my-account$/)
})

test('Clicking My Tasks routes to the My Tasks page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.my-tasks-button').click()
  await expect(page).toHaveURL(/\/my-tasks$/)
})

test('Clicking Slides routes to the Slides page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.slides-button').click()
  await expect(page).toHaveURL(/\/slides$/)
})

test('Clicking Media routes to the Media page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.media-button').click()
  await expect(page).toHaveURL(/\/media$/)
})

test('Clicking Courses routes to the Courses page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.courses-button').click()
  await expect(page).toHaveURL(/\/courses$/)
})

test('Clicking Operator Numbers routes to the Operator Numbers page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.operator-numbers-button').click()
  await expect(page).toHaveURL(/\/operatornumbers$/)
})

test('Clicking Certificates routes to the Certificates page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.certificates-button').click()
  await expect(page).toHaveURL(/\/certificates$/)
})

test('Clicking Purchase History routes to the Purchase History page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.purchase-history-button').click()
  await expect(page).toHaveURL(/\/purchase-history$/)
})

test('Clicking Logout routes to the Logout page', async ({ page }) => {
  await page.goto('/')

  await page.locator('.logout-button').click()
  await expect(page).toHaveURL(/\/logout$/)
})

test('Dashboard button is active on dashboard route', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.dashboard-button')).toHaveClass(/active/)
})

test('My Account button is active on My Account route', async ({ page }) => {
  await page.goto('/my-account')

  await expect(page.locator('.my-account-button')).toHaveClass(/active/)
})

test('My Tasks button is active on My Tasks route', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.my-tasks-button')).toHaveClass(/active/)
})

test('Slides button is active on Slides route', async ({ page }) => {
  await page.goto('/slides')

  await expect(page.locator('.slides-button')).toHaveClass(/active/)
})

test('Media button is active on Media route', async ({ page }) => {
  await page.goto('/media')

  await expect(page.locator('.media-button')).toHaveClass(/active/)
})

test('Courses button is active on Courses route', async ({ page }) => {
  await page.goto('/courses')

  await expect(page.locator('.courses-button')).toHaveClass(/active/)
})

test('Operator Numbers button is active on Operator Numbers route', async ({ page }) => {
  await page.goto('/operatornumbers')

  await expect(page.locator('.operator-numbers-button')).toHaveClass(/active/)
})

test('Certificates button is active on Certificates route', async ({ page }) => {
  await page.goto('/certificates')

  await expect(page.locator('.certificates-button')).toHaveClass(/active/)
})

test('Purchase History button is active on Purchase History route', async ({ page }) => {
  await page.goto('/purchase-history')

  await expect(page.locator('.purchase-history-button')).toHaveClass(/active/)
})

test('Logout button is active on Logout route', async ({ page }) => {
  await page.goto('/logout')

  await expect(page.locator('.logout-button')).toHaveClass(/active/)
})
