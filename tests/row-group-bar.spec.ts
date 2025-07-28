import { test, expect } from '@playwright/test';

test.describe('Row Group Bar', () => {
	test('One column to row group bar', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping-row-bar/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const emptyBarElEmptyText = await page.locator('.fg-row-group-bar-empty-text').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-one-column-to-row-group-bar.png');
	});

	test('One column to row group bar column drag', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping-row-bar/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const emptyBarElEmptyText = await page.locator('.fg-row-group-bar-empty-text').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const priceCell = await page.locator('.fg-header-cell[col-id="price"]').boundingBox();
		const brandCell = await page.locator('.fg-header-cell[col-id="brand"]').boundingBox();

		await page.mouse.move(priceCell.x + priceCell.width / 2 - 10, priceCell.y + priceCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(brandCell.x + brandCell.width / 2, brandCell.y + brandCell.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-one-column-to-row-group-bar-column-drag.png');
	});

	test('Two columns to row group bar', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping-row-bar/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const emptyBarElEmptyText = await page.locator('.fg-row-group-bar-empty-text').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(500);

		const brandCell = await page.locator('.fg-header-cell[col-id="brand"]').boundingBox();

		await page.mouse.move(brandCell.x + brandCell.width / 2, brandCell.y + brandCell.height / 2);
		await page.mouse.down();

		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-two-column-to-row-group-bar.png');
	});

	test('Three columns to row group bar', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping-row-bar/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const emptyBarElEmptyText = await page.locator('.fg-row-group-bar-empty-text').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(500);

		const brandCell = await page.locator('.fg-header-cell[col-id="brand"]').boundingBox();

		await page.mouse.move(brandCell.x + brandCell.width / 2, brandCell.y + brandCell.height / 2);
		await page.mouse.down();

		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(500);

		const modelCell = await page.locator('.fg-header-cell[col-id="model"]').boundingBox();

		await page.mouse.move(modelCell.x + modelCell.width / 2, modelCell.y + modelCell.height / 2);
		await page.mouse.down();

		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-three-column-to-row-group-bar.png');
	});

	test('One column and expand', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping-row-bar/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const emptyBarElEmptyText = await page.locator('.fg-row-group-bar-empty-text').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const box = await page.locator('div[row-group="Sweden"] div[col-id="1"] span.fg-row-group-cell-expander').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-one-column-and-expand.png');
	});


	test('One column and expand and collapse', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping-row-bar/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const emptyBarElEmptyText = await page.locator('.fg-row-group-bar-empty-text').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const box = await page.locator('div[row-group="Sweden"] div[col-id="1"] span.fg-row-group-cell-expander').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-one-column-and-expand-collapse.png');
	});

	test('Two columns to row group bar expand', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping-row-bar/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const emptyBarElEmptyText = await page.locator('.fg-row-group-bar-empty-text').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(500);

		const brandCell = await page.locator('.fg-header-cell[col-id="brand"]').boundingBox();

		await page.mouse.move(brandCell.x + brandCell.width / 2, brandCell.y + brandCell.height / 2);
		await page.mouse.down();

		await page.mouse.move(emptyBarElEmptyText.x + emptyBarElEmptyText.width / 2 - 10, emptyBarElEmptyText.y + emptyBarElEmptyText.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const box = await page.locator('div[row-group="Sweden"] div[col-id="1"] span.fg-row-group-cell-expander').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const box2 = await page.locator('div[row-group="Sweden-Volvo"] div[col-id="1"] span.fg-row-group-cell-expander').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-two-column-to-row-group-bar-expand.png');
	});
});
