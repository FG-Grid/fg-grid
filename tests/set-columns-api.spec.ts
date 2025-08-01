import { test, expect } from '@playwright/test';

test.describe('setColumns api', () => {
	test('Without filters', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/set-columns/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('#set-columns-without-filters').click();
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('without-filters.png');
	});

	test('Without filters and back', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/set-columns/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('#set-columns-without-filters').click();
		await page.waitForTimeout(700);

		await page.locator('#original').click();
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('without-filters-back.png');
	});

	test('Set hidden columns', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/set-columns/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('#hidden').click();
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('hidden.png');
	});
});
