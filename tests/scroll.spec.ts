import { expect, test } from '@playwright/test'

test.describe('Scroll', () => {
	test('Scroll 1', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-row[row-index="2"] .fg-cell[col-index="1"][col-id="brand"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('scroll-1-time.png');
	});

	test('Scroll 1, scroll back', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-row[row-index="2"] .fg-cell[col-index="1"][col-id="brand"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(400);

		await page.mouse.wheel(0, -300);
		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('scroll-1-back.png');
	});

	test('Scroll 2', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-row[row-index="2"] .fg-cell[col-index="1"][col-id="brand"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(400);

		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('scroll-2-time.png');
	});

	test('Scroll 3', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-row[row-index="2"] .fg-cell[col-index="1"][col-id="brand"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(400);

		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(400);

		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('scroll-3-time.png');
	});

	test('Scroll 20 times', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('.fg-row[row-index="2"] .fg-cell[col-index="1"][col-id="brand"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

		for (let i = 0; i < 17; i++) {
			await page.mouse.wheel(0, 300);
			await page.waitForTimeout(50);
		}

		await page.waitForTimeout(400);

		await expect(await gridEl.screenshot()).toMatchSnapshot('scroll-20-time.png');
	});
});
