import { test, expect } from '@playwright/test';

test.describe('Sort String Column: Grid API and click', () => {
	test('ASC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.sort(column, 'ASC');
		});

		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('sort-string-asc.png');
	});

	test('DESC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.sort(column, 'DESC');
		});

		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('sort-string-desc.png');
	});

	test('Click Header Cell: ASC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="brand"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('click-sort-string-asc.png');
	});

	test('2 Clicks Header Cell: DESC sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="brand"] .fg-header-cell-text').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('2-clicks-sort-string-desc.png');
	});

	test('3 Clicks Header Cell: clear sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="brand"] .fg-header-cell-text').boundingBox();
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

		await expect(await gridEl.screenshot()).toMatchSnapshot('3-clicks-sort-string-clear.png');
	});

	test('Click 3 different Header Cells: clear sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-header-cell[col-id="brand"] .fg-header-cell-text').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('.fg-header-cell[col-id="model"] .fg-header-cell-text').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});

		await page.waitForTimeout(700);

		const box3 = await page.locator('.fg-header-cell[col-id="price"] .fg-header-cell-text').boundingBox();
		await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('clicks-3-diff-columns-sort-clear.png');
	});
});
