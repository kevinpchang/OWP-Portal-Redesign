// This file contains end-to-end tests for the Dashboard Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/HeaderComponentE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Header loads dynamic elements correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.account_button')).toContainText('Silicon')
})

test('Account button dialog opens and displays correct information', async ({ page }) => {
    await page.goto('/')
    await page.click('.account_button')
    await expect(page.locator('.account-button-dialog .name')).toContainText('Silicon')
    await expect(page.locator('.account-button-dialog .email')).toContainText('siliconscribes@gmail.com')

})

test('Account button dialog opens and the \'My Account\' button routes to the My Account Page', async ({ page }) => {
    await page.goto('/')
    await page.click('.account_button')
    await page.click('.account-button-dialog .my-account-button')
    await expect(page).toHaveURL(/\/MyAccountPage/)
})

test('Account button dialog opens and the \'Contact Info\' button opens a separate dialog. The dialog displays correct information', async ({ page }) => {
    await page.goto('/')
    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await expect(page.locator('.contact-info-dialog')).toContainText('Silicon Scribes')
})

test('The contact info dialog successfully updates the user\'s contact information', async ({ page }) => {
    await page.goto('/')
    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await page.fill('.contact-info-dialog .left-subdiv .input-small', '9876543')
    await page.click('.contact-info-dialog .save')
})

test('The contact info dialog unsuccessfully updates the user\'s contact information and shows an error message', async ({ page }) => {
    await page.route('**/api/updateContactInfo', route => route.abort())
    
    await page.goto('/')
    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await page.fill('.contact-info-dialog .left-subdiv .input-small', '9876543')
    await page.click('.contact-info-dialog .save')

    const alertPromise = page.waitForEvent('dialog')
    const alert = await alertPromise
    expect(alert.message()).toContain('Error updating contact information. Please wait a moment and try again. If problem persists contact a site admin.')
    await alert.accept()
})

test('The page throws an error when retrieving user information, loads data from session instead. This checks if information on the Header is loaded', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.account_button')).toContainText('Silicon')

    await page.route('**/api/accountDetails/**', route => route.abort())
    const alertPromise = page.waitForEvent('dialog')
    await page.reload()

    const alert = await alertPromise
    await alert.accept()
    await expect(page.locator('.account_button')).toContainText('Silicon')
})
