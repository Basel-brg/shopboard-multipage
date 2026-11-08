import { test, expect } from '@playwright/test';

test.describe('Catalog and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders products grid with items', async ({ page }) => {
    const products = page.locator('.product-card');
    await expect(products).toHaveCount(10);
    const countBadge = page.locator('#products-count');
    await expect(countBadge).toContainText('عرض 10 من أصل 10');
  });

  test('filters products by category', async ({ page }) => {
    // Click on gaming category button
    const gamingBtn = page.locator('.category-btn', { hasText: 'أجهزة ألعاب' });
    await gamingBtn.click();
    await expect(gamingBtn).toHaveClass(/is-active/);

    const products = page.locator('.product-card');
    await expect(products).toHaveCount(1);
    await expect(page.locator('.product-card .product-name')).toContainText(
      'صندوق حاسب ألعاب Aorus',
    );
  });

  test('searches products by keyword', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('سماعة');
    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.locator('.product-card .product-name')).toContainText('سماعة استوديو');
  });

  test('sorts products deterministically by price', async ({ page }) => {
    const sortSelect = page.locator('#sort-select');
    await sortSelect.selectOption('price-asc');

    const firstProductPrice = page.locator('.product-card .price-current .amount').first();
    // Cheapest item is Desk Mat (125)
    await expect(firstProductPrice).toHaveText('125');

    // Switch back to default
    await sortSelect.selectOption('default');
    const resetFirstProduct = page.locator('.product-card .price-current .amount').first();
    // Default first product is Keyboard (310)
    await expect(resetFirstProduct).toHaveText('310');
  });
});
