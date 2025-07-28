import { test, expect } from '@playwright/test';

test.describe('Multi Sort: Grid API and click', () => {
	test('Click 3 different Header Cells with SHIFT', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="brand"] .fg-header-cell-text').boundingBox();
		await page.keyboard.down('Shift');
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({
			button: 'left'
		});
		await page.mouse.up({
			button: 'left',
		});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
		await page.keyboard.up('Shift');

		await page.waitForTimeout(1000);

		const box2 = await page.locator('.fg-header-cell[col-id="model"] .fg-header-cell-text').boundingBox();
		await page.keyboard.down('Shift');
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.down({button: 'left'});
		await page.mouse.up({button: 'left'});
		await page.keyboard.up('Shift');

		await page.waitForTimeout(1000);

		const box3 = await page.locator('.fg-header-cell[col-id="price"] .fg-header-cell-text').boundingBox();
		await page.keyboard.down('Shift');
		await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.mouse.down({button: 'left'});
		await page.mouse.up({button: 'left'});
		await page.keyboard.up('Shift');

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('multi-sort-click.png');
	});

	test('API multi sort several columns', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.sort(column, 'ASC', true);
		});

		await page.waitForTimeout(1000);

		await page.evaluate(() => {
			const column = grid.getColumn('model');
			grid.sort(column, 'ASC', true);
		});

		await page.waitForTimeout(1000);

		await page.evaluate(() => {
			const column = grid.getColumn('price');
			grid.sort(column, 'DESC', true);
		});

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('multi-sort-api.png');
	});
});
