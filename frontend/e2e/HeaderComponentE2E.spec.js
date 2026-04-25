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
    await expect(page.locator('.welcome-message')).toContainText('Hello, Silicon')
    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await page.fill('.contact-info-dialog #phone-local', '9876543')
    await page.fill('.contact-info-dialog #home-address', '123 Testing Way')
    await page.click('.contact-info-dialog .save')

    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await expect(page.locator('.contact-info-dialog #phone-local')).toHaveValue('9876543')
    await expect(page.locator('.contact-info-dialog #home-address')).toHaveValue('123 Testing Way')
})

test('The contact info dialog successfully filters inputs with special characters and defaults to previous values', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.welcome-message')).toContainText('Hello, Silicon')
    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await page.fill('.contact-info-dialog #phone-local', '123456!')
    await page.fill('.contact-info-dialog #home-address', '123 Street Way?')
    await page.click('.contact-info-dialog .save')

    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await expect(page.locator('.contact-info-dialog #phone-local')).toHaveValue('9876543')
    await expect(page.locator('.contact-info-dialog #home-address')).toHaveValue('123 Testing Way')
})

test('The contact info dialog unsuccessfully updates the user\'s contact information and shows an error message', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.welcome-message')).toContainText('Hello, Silicon')
    await page.click('.account_button')
    await page.click('.account-button-dialog #contact-info-button')
    await page.fill('.contact-info-dialog #phone-local', '9876543')
    await page.fill('.contact-info-dialog #home-address', '123 Testing Way')
    await page.route('**/api/updateContactInfo', route => route.abort())
    await page.click('.contact-info-dialog .save')

    const dialogHandled = new Promise((resolve, reject) => {
        page.once('dialog', async dialog => {
            try {
                expect(dialog.type()).toBe('alert')
                expect(dialog.message()).toContain('Error updating contact information')

                await dialog.accept()
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    })

    await dialogHandled
})

test('The page throws an error when retrieving user information, loads data from session instead. This checks if information on the Header is loaded', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.welcome-message')).toContainText('Hello, Silicon')
    await expect(page.locator('.account_button')).toContainText('Silicon')

    await page.route('**/api/accountDetails/**', route => route.abort())
    
    const dialogHandled = new Promise((resolve, reject) => {
        page.once('dialog', async dialog => {
            try {
                expect(dialog.type()).toBe('alert')
                expect(dialog.message()).toContain('Some data could not be refreshed')

                await dialog.accept()
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    })

    await page.reload()
    await dialogHandled

    await expect(page.locator('.account_button')).toContainText('Silicon')
})
