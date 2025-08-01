import { test, expect } from '@playwright/test';

test.describe('Column Group', () => {
	test('Render', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-column-group/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('render.png');
	});

	test('Navigate to end of columns', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-column-group/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(1000);

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

		await expect(await gridEl.screenshot()).toMatchSnapshot('navigate-to-end.png');
	});

	test('Hide columns of Main Group', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-column-group/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const columnBrand = grid.getColumn('brand');
			grid.hideColumn(columnBrand);
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			const columnModel = grid.getColumn('model');
			grid.hideColumn(columnModel);
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('hide-columns-main.png');
	});

	test('Hide and show columns of Main Group', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-column-group/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const columnBrand = grid.getColumn('brand');
			grid.hideColumn(columnBrand);
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			const columnModel = grid.getColumn('model');
			grid.hideColumn(columnModel);
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			const columnBrand = grid.getColumn('brand');
			grid.showColumn(columnBrand);
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			const columnModel = grid.getColumn('model');
			grid.showColumn(columnModel);
		});

		await expect(await gridEl.screenshot()).toMatchSnapshot('hide-show-columns-main.png');
	});
});
