import { test, expect } from '@playwright/test';

test.describe('Orders Management Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('opens orders modal and renders list with order cards', async ({ page }) => {
    const ordersBtn = page.locator('#orders-toggle-btn');
    await expect(ordersBtn).toBeVisible();
    await ordersBtn.click();

    const ordersDialog = page.locator('#orders-dialog');
    await expect(ordersDialog).toBeVisible();

    const orderCards = page.locator('.order-card');
    await expect(orderCards.first()).toBeVisible();
    const count = await orderCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('filters orders by search query and status', async ({ page }) => {
    await page.locator('#orders-toggle-btn').click();
    await expect(page.locator('#orders-dialog')).toBeVisible();

    const searchInput = page.locator('#orders-search-input');
    await searchInput.fill('SB-849201');

    const cards = page.locator('.order-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().locator('.order-num')).toContainText('SB-849201');
  });

  test('simulates 4 lifecycle states on purpose using the test toolbar', async ({ page }) => {
    await page.locator('#orders-toggle-btn').click();
    await expect(page.locator('#orders-dialog')).toBeVisible();

    // 1. Simulate Loading state
    await page.locator('button[data-orders-state="loading"]').click();
    await expect(page.locator('.order-card-skeleton').first()).toBeVisible();

    // 2. Simulate Error state with Try Again button
    await page.locator('button[data-orders-state="error"]').click();
    const retryBtn = page.locator('#orders-retry-btn');
    await expect(retryBtn).toBeVisible();
    await expect(page.locator('.state-error')).toContainText('خطأ 503');

    // 3. Simulate Empty (No Orders) state
    await page.locator('button[data-orders-state="empty-server"]').click();
    await expect(page.locator('.state-empty')).toContainText('لا توجد طلبات سابقة');

    // 4. Return to Live state via Live button
    await page.locator('button[data-orders-state="live"]').click();
    await expect(page.locator('.order-card').first()).toBeVisible();
  });

  test('opens order details dialog with full breakdown', async ({ page }) => {
    await page.locator('#orders-toggle-btn').click();
    await expect(page.locator('#orders-dialog')).toBeVisible();

    const firstDetailsBtn = page.locator('.btn-order-details').first();
    await firstDetailsBtn.click();

    const detailsDialog = page.locator('#order-details-modal');
    await expect(detailsDialog).toBeVisible();
    await expect(detailsDialog.locator('.modal-item-row').first()).toBeVisible();
  });
});
