import { test, expect } from '@playwright/test';

test.describe('Authentication and User Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('opens auth modal and performs login', async ({ page }) => {
    await page.locator('#auth-toggle-btn').click();
    const dialog = page.locator('#auth-dialog');
    await expect(dialog).toBeVisible();

    await page.locator('#login-email').fill('testuser@example.com');
    await page.locator('#login-password').fill('password123');
    await page.locator('#login-form button[type="submit"]').click();

    await expect(dialog).not.toBeVisible();

    // Verify user name shown on auth toggle button
    const authBtnLabel = page.locator('#auth-btn-label');
    await expect(authBtnLabel).toHaveText('testuser');

    // Reopen dialog to see profile
    await page.locator('#auth-toggle-btn').click();
    await expect(page.locator('#auth-user-name')).toContainText('testuser');
    await expect(page.locator('#auth-user-email')).toHaveText('testuser@example.com');

    // Logout
    await page.locator('#auth-logout-btn').click();
    await expect(authBtnLabel).toHaveText('الإعدادات');
  });

  test('validates invalid email on registration', async ({ page }) => {
    await page.locator('#auth-toggle-btn').click();
    await page.locator('#tab-register').click();

    await page.locator('#register-name').fill('أحمد');
    await page.locator('#register-email').fill('invalid-email');
    await page.locator('#register-phone').fill('0500000000');
    await page.locator('#register-password').fill('pass123');

    await page.locator('#register-form button[type="submit"]').click();

    // Field error appears
    const errorEl = page.locator('#register-email-error');
    await expect(errorEl).toBeVisible();
    await expect(errorEl).toContainText('عنوان بريد إلكتروني صالح');
  });
});
