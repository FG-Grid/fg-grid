import { test, expect } from '@playwright/test';

test.describe('Filter', () => {
	test('Key Navigate to End', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await expect(await gridEl.screenshot()).toMatchSnapshot('navigate-to-end.png');
	});

	test('Key Navigate to End and Back', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);

		await expect(await gridEl.screenshot()).toMatchSnapshot('navigate-to-end-back.png');
	});

	test('Key Navigate to End, Back, End ', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await expect(await gridEl.screenshot()).toMatchSnapshot('navigate-to-end-back-end.png');
	});

	test('Key Navigate to End, Back, End, Back ', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);

		await expect(await gridEl.screenshot()).toMatchSnapshot('navigate-to-end-back-end-back.png');
	});

	test('Boolean Filter True', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.locator('.fg-filter-bar-cell[col-id="electric"] .fg-filter-field-sign').click();
		await page.waitForTimeout(700);

		await page.locator('.fg-filter-field-list .fg-filter-field-list-item[sign="T"]').click();
		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-boolean-true.png');
	});

	test('Boolean Filter False', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.locator('.fg-filter-bar-cell[col-id="electric"] .fg-filter-field-sign').click();
		await page.waitForTimeout(700);

		await page.locator('.fg-filter-field-list .fg-filter-field-list-item[sign="F"]').click();
		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-boolean-false.png');
	});

	test('Boolean Filter True False', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.locator('.fg-filter-bar-cell[col-id="electric"] .fg-filter-field-sign').click();
		await page.waitForTimeout(700);

		await page.locator('.fg-filter-field-list .fg-filter-field-list-item[sign="T"]').click();
		await page.waitForTimeout(1000);

		await page.locator('.fg-filter-bar-cell[col-id="electric"] .fg-filter-field-sign').click();
		await page.waitForTimeout(700);

		await page.locator('.fg-filter-field-list .fg-filter-field-list-item[sign="F"]').click();
		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-boolean-true-false.png');
	});

	test('Boolean Filter True Scroll Back and End', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await page.locator('.fg-filter-bar-cell[col-id="electric"] .fg-filter-field-sign').click();
		await page.waitForTimeout(700);

		await page.locator('.fg-filter-field-list .fg-filter-field-list-item[sign="T"]').click();
		await page.waitForTimeout(1000);

		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowLeft');
		await page.waitForTimeout(100);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-boolean-true-scroll-back-end.png');
	});
});
