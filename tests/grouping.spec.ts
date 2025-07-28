import { test, expect } from '@playwright/test';

test.describe('Grouping', () => {
	test('Render', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('grouping.png');
	});

	test('Collapse', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('[row-group="Sweden-Volvo-S60"] .fg-row-group-cell-expander').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('collapse.png');
	});

	test('Select row', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('[row-index="8"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-row.png');
	});

	test('Select row, unselect row', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('[row-index="8"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-row-unselect.png');
	});

	test('Select group', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('[row-index="7"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-row-group.png');
	});

	test('Select group, unselect group', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('[row-index="7"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-row-group-unselect.png');
	});

	test('Select all', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('.fg-header-cell[col-index="1"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-all.png');
	});

	test('Select all, unselect all', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('.fg-header-cell[col-index="1"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-all-unselect-all.png');
	});

	test('Select all, unselect one', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('.fg-header-cell[col-index="1"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('[row-index="4"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-all-unselect-one.png');
	});

	test('Select all, unselect one, select back', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('.fg-header-cell[col-index="1"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('[row-index="4"] .fg-input-checkbox').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('select-all-unselect-one-select-back.png');
	});

	test('Collapse Sweden', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-grouping/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.waitForTimeout(700);

		const box = await page.locator('[row-group="Sweden"] .fg-row-group-cell-expander').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('collapse-sweden.png');
	});
});
