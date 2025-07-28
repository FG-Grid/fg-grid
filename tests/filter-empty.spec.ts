import { test, expect } from '@playwright/test';

test.describe('Filter Empty', () => {
	test('Country', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="country"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('[sign="Empty"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('empty-country.png');
	});

	test('Model', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="model"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('[sign="Empty"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('empty-model.png');
	});

	test('Year', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="year"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('[sign="Empty"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('empty-year.png');
	});

	test('Model Empty, Not Empty', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="model"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(500);

		const box2 = await page.locator('[sign="Empty"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(500);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box3 = await page.locator('[sign="Not Empty"]').boundingBox();
		await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.mouse.click(box3.x + box3.width / 2, box3.y + box3.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('empty-not-empty-model.png');
	});

	test('Country Empty, Not Empty', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="country"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('[sign="Empty"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(500);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box3 = await page.locator('[sign="Not Empty"]').boundingBox();
		await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.mouse.click(box3.x + box3.width / 2, box3.y + box3.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('empty-not-empty-country.png');
	});

	test('Year Empty, Not Empty', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="year"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box2 = await page.locator('[sign="Empty"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const box3 = await page.locator('[sign="Not Empty"]').boundingBox();
		await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.mouse.click(box3.x + box3.width / 2, box3.y + box3.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('empty-not-empty-year.png');
	});

	test('Year Positive, Negative', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="year"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const scrollBox = await page.locator('.fg-filter-field-list').boundingBox();
		await page.mouse.move(scrollBox.x + scrollBox.width / 2, scrollBox.y + scrollBox.height / 2);
		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(700);

		const box2 = await page.locator('[sign="Positive"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(700);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		const scrollBox2 = await page.locator('.fg-filter-field-list').boundingBox();
		await page.mouse.move(scrollBox2.x + scrollBox2.width / 2, scrollBox2.y + scrollBox2.height / 2);
		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(700);

		const box3 = await page.locator('[sign="Negative"]').boundingBox();
		await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.mouse.click(box3.x + box3.width / 2, box3.y + box3.height / 2);

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('positive-negative-year.png');
	});
});
