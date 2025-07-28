import { expect, test } from '@playwright/test'

test.describe('Sort Number Column: Grid API and click', () => {
	test('ASC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('price');
			grid.sort(column, 'ASC');
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('sort-number-asc.png');
	});

	test('DESC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('price');
			grid.sort(column, 'DESC');
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('sort-number-desc.png');
	});

	test('Click Header Cell: ASC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="price"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('click-sort-number-asc.png');
	});

	test('2 Clicks Header Cell: DESC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="price"] .fg-header-cell-text').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('2-clicks-sort-number-desc.png');
	});

	test('3 Clicks Header Cell: clear sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="price"] .fg-header-cell-text').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});

		await page.waitForTimeout(700);

		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('3-clicks-sort-number-clear.png');
	});
});
