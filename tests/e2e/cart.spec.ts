import { test, expect } from '@playwright/test';

test.describe('Cart and Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('adds product to cart and verifies badge count and drawer', async ({ page }) => {
    const addBtn = page.locator('.btn-add-cart').first();
    await addBtn.click();

    // Verify badge count
    const cartBadge = page.locator('#cart-badge');
    await expect(cartBadge).toHaveText('1');

    // Open drawer
    await page.locator('#cart-toggle-btn').click();
    const cartDrawer = page.locator('#cart-drawer');
    await expect(cartDrawer).toHaveClass(/is-open/);

    // Verify item in list
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems.first().locator('.item-name')).toContainText(
      'لوحة مفاتيح ميكانيكية لاسلكية',
    );
  });

  test('updates quantity and removes item from cart', async ({ page }) => {
    // Add item
    await page.locator('.btn-add-cart').first().click();
    await page.locator('#cart-toggle-btn').click();

    // Increase quantity
    const increaseBtn = page.locator('button[data-action="increase"]').first();
    await increaseBtn.click();
    await expect(page.locator('.qty-display').first()).toHaveText('2');
    await expect(page.locator('#cart-badge')).toHaveText('2');

    // Delete item
    const deleteBtn = page.locator('button[data-action="delete"]').first();
    await deleteBtn.click();

    await expect(page.locator('#cart-empty-view')).toBeVisible();
    await expect(page.locator('#cart-badge')).toHaveText('0');
  });

  test('applies valid discount coupon', async ({ page }) => {
    // Add item worth 310
    await page.locator('.btn-add-cart').first().click();
    await page.locator('#cart-toggle-btn').click();

    const couponInput = page.locator('#coupon-code');
    await couponInput.fill('SHOP20');
    await page.locator('#coupon-form button[type="submit"]').click();

    // Verify discount applied
    const appliedTag = page.locator('#applied-coupon-tag');
    await expect(appliedTag).toBeVisible();
    await expect(appliedTag).toContainText('SHOP20');
  });

  test('completes checkout and displays order confirmation dialog', async ({ page }) => {
    await page.locator('.btn-add-cart').first().click();
    await page.locator('#cart-toggle-btn').click();

    await page.locator('#customer-name').fill('محمد أحمد');
    await page.locator('#customer-phone').fill('0501234567');
    await page.locator('#customer-city').fill('الرياض');

    await page.locator('#checkout-form button[type="submit"]').click();

    const orderDialog = page.locator('#order-dialog');
    await expect(orderDialog).toBeVisible();
    await expect(page.locator('#dialog-order-msg')).toContainText('محمد أحمد');
  });
});
