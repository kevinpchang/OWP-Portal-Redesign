// This file contains end-to-end tests for the Sidebar using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/BadResponseHandlingE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('Dashboard page alerts when account details fail to load', async ({ page }) => {
    await page.goto('/')
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
    
    await page.goto('/')
    await dialogHandled
})

test('Certificates page alerts when account details fail to load', async ({ page }) => {
    await page.goto('/certificates')
    await page.route('**/api/getActiveEnrollment/**', route => route.abort())

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
    
    await page.goto('/certificates') 
    await dialogHandled
})

test('Courses page alerts when active enrollment details fail to load', async ({ page }) => {
    await page.goto('/courses')
    await page.route('**/api/activeEnrollment/**', route => route.abort())

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
    
    await page.goto('/courses')
    await dialogHandled
})

test('My Account page alerts when account details fail to load', async ({ page }) => {
    await page.goto('/MyAccountPage')
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
    
    await page.goto('/MyAccountPage')
    await dialogHandled
})

test('My Tasks page alerts when account details fail to load', async ({ page }) => {
    await page.goto('/my-tasks')
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
    
    await page.goto('/my-tasks')
    await dialogHandled
})

test('Operator Numbers page alerts when account details fail to load', async ({ page }) => {
    await page.goto('/operatornumbers')
    await page.route('**/api/getOperatorList/**', route => route.abort())

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
    
    await page.goto('/operatornumbers')
    await dialogHandled
})

test('Purchase History page alerts when account details fail to load', async ({ page }) => {
    await page.goto('/purchase-history')
    await page.route('**/api/getInvoices/**', route => route.abort())

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
    
    await page.goto('/purchase-history')
    await dialogHandled
})