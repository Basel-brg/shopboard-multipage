import { test, expect } from '@playwright/test';

test.describe('3D Desk Builder Studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('opens 3D desk builder modal and renders WebGL canvas', async ({ page }) => {
    const openBtn = page.locator('#btn-open-desk-builder');
    await openBtn.click();

    const dialog = page.locator('#desk-builder-modal');
    await expect(dialog).toBeVisible();

    const canvas = page.locator('#studio-3d-canvas canvas');
    await expect(canvas).toBeVisible();

    const catalogCards = page.locator('.studio-product-card');
    await expect(catalogCards).toHaveCount(10);
  });

  test('adds item to 3D desk setup via keyboard and transfers setup to cart', async ({ page }) => {
    await page.locator('#btn-open-desk-builder').click();

    // Select the first product card and press Enter to spawn at center
    const firstCard = page.locator('.studio-product-card').first();
    await firstCard.focus();
    await page.keyboard.press('Enter');

    // Total price updates
    const totalBadge = page.locator('#studio-total-price');
    await expect(totalBadge).not.toHaveText('0 ر.س');

    // Click Add to Cart
    await page.locator('#studio-add-cart-btn').click();

    // Desk builder modal closes
    const dialog = page.locator('#desk-builder-modal');
    await expect(dialog).not.toBeVisible();

    // Cart drawer opens and contains item
    const cartDrawer = page.locator('#cart-drawer');
    await expect(cartDrawer).toHaveClass(/is-open/);
    await expect(page.locator('#cart-badge')).toHaveText('1');
  });
});
