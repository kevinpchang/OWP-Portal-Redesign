// This file contains end-to-end tests for the Operator Numbers Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/OperatorNumbersE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Operator Numbers page loads main sections correctly', async ({ page }) => {
  await page.goto('/operatornumbers')

  await expect(page.locator('.title')).toContainText('Operator Numbers')
  
})