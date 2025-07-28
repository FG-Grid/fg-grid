import { test, expect } from '@playwright/test';

test.describe('Column resize', () => {
	test('Column resize brand price', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const resizeBrand = await page.locator('.fg-header-cell[col-id="brand"] .fg-header-cell-resize').boundingBox();

		await page.mouse.move(resizeBrand.x + 1, resizeBrand.y + 1);
		await page.mouse.down();

		await page.mouse.move(resizeBrand.x + 70, resizeBrand.y);

		await page.mouse.up();

		await page.waitForTimeout(1000);

		const resizePrice = await page.locator('.fg-header-cell[col-id="price"] .fg-header-cell-resize').boundingBox();

		await page.mouse.move(resizePrice.x + 1, resizePrice.y + 1);
		await page.mouse.down();

		await page.mouse.move(resizePrice.x + 70, resizePrice.y);

		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('column-resize-brand-price.png');
	});
});
