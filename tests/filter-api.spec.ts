import { test, expect } from '@playwright/test';

test.describe('Filter API', () => {
	test('Brand BMW', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.filter(column, 'BMW');
		});

		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-brand-BMW.png');
	});

	test('Brand BMW, Toyota', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.filter(column, 'BMW');
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.filter(column, 'Toyota');
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-brand-BMW-Toyota.png');
	});

	test('Price less 50000', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('price');
			grid.filter(column, 55000, '<');
		});

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-price-less-55000.png');
	});

	test('Price more 55000', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('price');
			grid.filter(column, 55000, '>');
		});

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-price-more-55000.png');
	});

	test('Price less, more 55000', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('price');
			grid.filter(column, 55000, '<');
		});

		await page.evaluate(() => new Promise(resolve => {
			setTimeout(() => {
				resolve('Done');
			}, 700)
		}));

		await page.evaluate(() => {
			const column = grid.getColumn('price');
			grid.filter(column, 50000, '>');
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-price-less-more-55000.png');
	});

	test('2 columns with delay', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.filter(column, 'Audi');
		});

		await page.waitForTimeout(500);

		await page.evaluate(() => {
			const column = grid.getColumn('model');
			grid.filter(column, 'Q7');
		});

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-2-columns-delay.png');
	});

	test('2 columns', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const columnBrand = grid.getColumn('brand');
			grid.filter(columnBrand, 'Audi');

			const columnModel = grid.getColumn('model');
			grid.filter(columnModel, 'Q7');
		});

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-2-columns.png');
	});

	test('string number', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const columnBrand = grid.getColumn('brand');
			grid.filter(columnBrand, 'Audi');

			const columnPrice = grid.getColumn('price');
			grid.filter(columnPrice, 70000, '>');
		});

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-string-number.png');
	});

	test('Ends with', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('country');
			grid.filter(column, 'sa', '_a');
		});

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('ends-with.png');
	});

	test('Starts with', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('country');
			grid.filter(column, 'us', 'a_');
		});

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('starts-with.png');
	});

	test('Filter and sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			const column = grid.getColumn('brand');
			grid.filter(column, 'Audi');
		});

		await page.waitForTimeout(500);

		const box = await page.locator('.fg-header-cell[col-id="price"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('filter-sort.png');
	});
});
