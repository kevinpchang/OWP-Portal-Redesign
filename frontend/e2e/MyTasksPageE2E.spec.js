// This file contains end-to-end tests for the My Tasks Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/MyTasksPageE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test('My Tasks page loads main sections correctly', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.title')).toHaveText('Tasks Overview')
  await expect(page.locator('.task-box')).toHaveCount(4)
  await expect(page.locator('.task-header')).toContainText([
    'Completed Tasks',
    'Overall Progress',
    'Upcoming Tasks',
    'Overdue Tasks',
  ])
})

test('Completed Tasks section renders task rows', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.task-box').nth(0)).toContainText('Ch-3 Small Water Treatment Plants')
  await expect(page.locator('.task-box').nth(0)).toContainText('Ch-4 Disinfection')
  await expect(page.locator('.task-box').nth(0)).toContainText('Ch-5 Safety')
})

test('Upcoming Tasks section renders task rows', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.task-box').nth(2)).toContainText('Ch-7 Introduction to Small System Management')
  await expect(page.locator('.task-box').nth(2)).toContainText('Final Exam')
})

test('Overdue Tasks section renders task rows', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.task-box').nth(3)).toContainText('Ch-6 Laboratory Procedures')
  await expect(page.locator('.task-box').nth(3)).toContainText('5 days overdue')
})

test('Overall Progress ring shows the correct percentage', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.ring-text')).toHaveText('63%')
})

test('My Tasks page shows subtitle correctly', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.subtitle')).toContainText(
    'View your completed, upcoming, and overdue course tasks all in one place.'
  )
})

test('My Tasks page does not crash while rendering API-driven content', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('body')).toContainText('Tasks Overview')
  await expect(page.locator('body')).toContainText('Overall Progress')
  await expect(page.locator('body')).toContainText('Final Exam')
})

test('My Tasks page keeps all four cards visible', async ({ page }) => {
  await page.goto('/my-tasks')

  await expect(page.locator('.task-box').nth(0)).toBeVisible()
  await expect(page.locator('.task-box').nth(1)).toBeVisible()
  await expect(page.locator('.task-box').nth(2)).toBeVisible()
  await expect(page.locator('.task-box').nth(3)).toBeVisible()
})