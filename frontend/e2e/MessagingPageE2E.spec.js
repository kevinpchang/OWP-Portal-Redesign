// This file contains end-to-end tests for the Messaging Page using Playwright.
// To use:
// Open a Terminal and cd to the frontend directory
// To run individually: npx playwright test e2e/MessagingPageE2E.spec.js --project=chromium
// To run all frontend tests: npx playwright test --project=chromium

import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/messaging/threads?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        threads: [
          {
            ThreadId: 101,
            LastSenderName: 'Alice',
            LastSenderEmail: 'alice@owp.csus.edu',
            SubjectPreview: 'Welcome',
            LastBody: 'Hello from Alice',
            LastSentAt: '2026-04-07T15:11:00.000Z',
            CreatedAt: '2026-04-07T15:11:00.000Z',
            UnreadCount: 1,
            IsStarred: false,
          },
          {
            ThreadId: 102,
            LastSenderName: 'Bob',
            LastSenderEmail: 'bob@owp.csus.edu',
            SubjectPreview: 'Project Update',
            LastBody: 'Here is the latest update',
            LastSentAt: '2026-04-06T12:30:00.000Z',
            CreatedAt: '2026-04-06T12:30:00.000Z',
            UnreadCount: 0,
            IsStarred: true,
          },
        ],
      }),
    })
  })

  await page.route('**/api/messaging/threads/101?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        thread: {
          ThreadId: 101,
          SubjectPreview: 'Welcome',
          LastMessageAt: '2026-04-07T15:11:00.000Z',
        },
        messages: [
          {
            MessageId: 1001,
            SenderDisplayName: 'Alice',
            SenderEmail: 'alice@owp.csus.edu',
            SentAt: '2026-04-07T15:11:00.000Z',
            Body: 'Hello from Alice',
          },
          {
            MessageId: 1002,
            SenderDisplayName: 'You',
            SenderEmail: 'you@owp.csus.edu',
            SentAt: '2026-04-07T15:20:00.000Z',
            Body: 'Thanks Alice',
          },
        ],
      }),
    })
  })

  await page.route('**/api/messaging/threads/102?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        thread: {
          ThreadId: 102,
          SubjectPreview: 'Project Update',
          LastMessageAt: '2026-04-06T12:30:00.000Z',
        },
        messages: [
          {
            MessageId: 2001,
            SenderDisplayName: 'Bob',
            SenderEmail: 'bob@owp.csus.edu',
            SentAt: '2026-04-06T12:30:00.000Z',
            Body: 'Here is the latest update',
          },
        ],
      }),
    })
  })

  await page.route('**/api/messaging/threads/101/reply', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.route('**/api/messaging/threads', async (route, request) => {
    if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ threadId: 101 }),
      })
      return
    }

    await route.continue()
  })

  await page.route('**/api/messaging/threads/*/star', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })
})

test('Messaging page loads main sections correctly', async ({ page }) => {
  await page.goto('/messages')

  await expect(page.locator('.page-title')).toContainText('Inbox')
  await expect(page.locator('.search-input')).toBeVisible()
  await expect(page.locator('.compose-btn')).toBeVisible()
  await expect(page.locator('.thread-list')).toBeVisible()
  await expect(page.locator('.mail-reader')).toBeVisible()
})

test('Messaging page shows thread list correctly', async ({ page }) => {
  await page.goto('/messages')

  await expect(page.locator('.thread-row')).toHaveCount(2)
  await expect(page.locator('.thread-row').first()).toContainText('Alice')
  await expect(page.locator('.thread-row').first()).toContainText('Welcome')
  await expect(page.locator('.thread-row').nth(1)).toContainText('Bob')
  await expect(page.locator('.thread-row').nth(1)).toContainText('Project Update')
})

test('Selecting a thread displays the correct message content', async ({ page }) => {
  await page.goto('/messages')

  const firstThread = page.locator('.thread-row').first()
  await expect(firstThread).toBeVisible()
  await firstThread.click()

  await expect(page.locator('.reader-subject')).toContainText('Welcome')
  await expect(page.locator('.email-card')).toHaveCount(2)
  await expect(page.locator('.email-card').first()).toContainText('Hello from Alice')
})

test('Compose button opens the new message modal', async ({ page }) => {
  await page.goto('/messages')

  await page.locator('.compose-btn').click()

  await expect(page.locator('.compose-modal')).toBeVisible()
  await expect(page.locator('.compose-title')).toContainText('New Message')
  await expect(page.locator('.compose-input').first()).toBeVisible()
  await expect(page.locator('.compose-textarea')).toBeVisible()
})

test('Unread filter shows only unread messages', async ({ page }) => {
  await page.goto('/messages')

  await page.locator('.filter-chip', { hasText: 'Unread' }).click()

  await expect(page.locator('.thread-row')).toHaveCount(1)
  await expect(page.locator('.thread-row').first()).toContainText('Alice')
})
