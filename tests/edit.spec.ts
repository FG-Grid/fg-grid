import { test, expect } from '@playwright/test';

test.describe('Edit', () => {
	test('Edit number', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="price"]').dblclick();
		await page.waitForTimeout(700);

		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');

		await page.locator('.fg-field-input').type('35000', { delay: 50 });
		await page.waitForTimeout(700);

		await page.keyboard.press('Enter');
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('edit-number.png');
	});

	test('Edit string', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').dblclick();
		await page.waitForTimeout(700);

		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');

		await page.locator('.fg-field-input').type('Toyota', { delay: 50 });
		await page.waitForTimeout(700);

		await page.keyboard.press('Enter');
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('edit-string.png');
	});

	test('Edit country', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter-empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-2"] [col-id="country"]').dblclick();
		await page.waitForTimeout(700);

		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');

		await page.waitForTimeout(700);

		await page.locator('.fg-field-input').type('Germany', { delay: 50 });
		await page.waitForTimeout(700);

		await page.keyboard.press('Enter');
		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('edit-country.png');
	});

	test('Edit number, sort', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="year"]').dblclick();
		await page.waitForTimeout(700);

		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');

		await page.locator('.fg-field-input').type('2015', { delay: 50 });
		await page.waitForTimeout(700);

		await page.keyboard.press('Enter');
		await page.waitForTimeout(700);

		const box = await page.locator('.fg-header-cell[col-id="year"]').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.down({button: 'left', clickCount: 1});
		await page.mouse.up({button: 'left', clickCount: 1});
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(500);

		await expect(await gridEl.screenshot()).toMatchSnapshot('edit-number-sort.png');
	});

	test('Edit number, filter', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows-filter/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="year"]').dblclick();
		await page.waitForTimeout(700);

		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');

		await page.locator('.fg-field-input').type('2015', { delay: 50 });
		await page.keyboard.press('Enter');

		await page.waitForTimeout(700);

		const box = await page.locator('.fg-filter-bar-inner-container .fg-filter-bar-cell[col-id="year"] .fg-filter-field-input').boundingBox();
		await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await page.waitForTimeout(700);

		await page.locator('.fg-filter-bar-inner-container .fg-filter-bar-cell[col-id="year"] .fg-filter-field-input').type('2015', { delay: 100 });

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('edit-number-filter.png');
	});
});
