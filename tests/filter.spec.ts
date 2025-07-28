import { test, expect } from '@playwright/test';

test.describe('Filter', () => {
	test('Typing Toyota', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('.fg-filter-bar-cell[col-id="brand"] input').type('Toyota', { delay: 50 });
		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('typing.png');
	});

	test('Typing Toyota, removing Toyota', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('.fg-filter-bar-cell[col-id="brand"] input').type('Toyota', { delay: 100 });
		await page.waitForTimeout(1000);

		for (let i = 0; i < 'Toyota'.length; i++) {
			await page.keyboard.press('Backspace');
		}

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('typing-remove.png');
	});

	test('Number filtering less', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="price"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(1000);

		const scrollBox = await page.locator('.fg-filter-field-list').boundingBox();
		await page.mouse.move(scrollBox.x + scrollBox.width / 2, scrollBox.y + scrollBox.height / 2);
		await page.mouse.wheel(0, 300);
		await page.evaluate(() => new Promise(resolve => {
			setTimeout(() => {
				resolve('Done');
			}, 700)
		}));

		const box2 = await page.locator('[sign="Less Than"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.waitForTimeout(500);

		await page.locator('.fg-filter-bar-cell[col-id="price"] input').type('75000', { delay: 50 });
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('number-filtering-less.png');
	});

	test('Number filtering less and remove', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="price"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
		await page.waitForTimeout(1000);

		const scrollBox = await page.locator('.fg-filter-field-list').boundingBox();
		await page.mouse.move(scrollBox.x + scrollBox.width / 2, scrollBox.y + scrollBox.height / 2);
		await page.mouse.wheel(0, 300);
		await page.evaluate(() => new Promise(resolve => {
			setTimeout(() => {
				resolve('Done');
			}, 700)
		}));

		const box2 = await page.locator('[sign="Less Than"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);

		await page.waitForTimeout(500);
		await page.locator('.fg-filter-bar-cell[col-id="price"] input').type('75000', { delay: 50 });

		await page.waitForTimeout(700);

		for (let i = 0; i < 'Toyota'.length; i++) {
			await page.keyboard.press('Backspace');
		}

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('number-filtering-less-remove.png');
	});

	test('Number filtering less and clear', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const box = await page.locator('[col-id="price"] div.fg-filter-field-sign').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
		await page.waitForTimeout(1000);

		const scrollBox = await page.locator('.fg-filter-field-list').boundingBox();
		await page.mouse.move(scrollBox.x + scrollBox.width / 2, scrollBox.y + scrollBox.height / 2);
		await page.mouse.wheel(0, 300);
		await page.waitForTimeout(700);

		const box2 = await page.locator('[sign="Less Than"]').boundingBox();
		await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.mouse.click(box2.x + box2.width / 2, box2.y + box2.height / 2);
		await page.waitForTimeout(700);

		await page.locator('.fg-filter-bar-cell[col-id="price"] input').type('75000', { delay: 50 });
		await page.waitForTimeout(700);

		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
		await page.waitForTimeout(700);

		await page.mouse.move(scrollBox.x + scrollBox.width / 2, scrollBox.y + scrollBox.height / 2);
		await page.mouse.wheel(0, -300);
		await page.waitForTimeout(700);

		const box3 = await page.locator('[sign="Clear"]').boundingBox();
		await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.mouse.click(box3.x + box3.width / 2, box3.y + box3.height / 2);
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('number-filtering-less-clear.png');
	});
});
