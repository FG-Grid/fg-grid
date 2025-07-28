import { test, expect } from '@playwright/test';

test.describe('Drag columns', () => {
	test('From left to right', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const brandCell = await page.locator('.fg-header-cell[col-id="brand"]').boundingBox();
		const yearCell = await page.locator('.fg-header-cell[col-id="year"]').boundingBox();

		await page.mouse.move(brandCell.x + brandCell.width / 2, brandCell.y + brandCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(yearCell.x + yearCell.width / 2 - 10, yearCell.y + yearCell.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('from-left-to-right.png');
	});

	test('From right to left', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const brandCell = await page.locator('.fg-header-cell[col-id="brand"]').boundingBox();
		const yearCell = await page.locator('.fg-header-cell[col-id="year"]').boundingBox();

		await page.mouse.move(yearCell.x + yearCell.width / 2 - 10, yearCell.y + yearCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(brandCell.x + brandCell.width / 2, brandCell.y + brandCell.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('from-right-to-left.png');
	});

	test('Navigate: From right to left', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		const fuelCell = await page.locator('.fg-header-cell[col-id="fueltype"]').boundingBox();
		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();

		await page.mouse.move(fuelCell.x + fuelCell.width / 2 - 10, fuelCell.y + fuelCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('navigate-from-right-to-left.png');
	});

	test('Navigate: From left to right', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.locator('[row-id="id-1"] [col-id="brand"]').click();
		await page.waitForTimeout(700);

		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);
		await page.keyboard.press('ArrowRight');
		await page.waitForTimeout(100);

		const countryCell = await page.locator('.fg-header-cell[col-id="country"]').boundingBox();
		const fuelCell = await page.locator('.fg-header-cell[col-id="fueltype"]').boundingBox();

		await page.mouse.move(countryCell.x + countryCell.width / 2, countryCell.y + countryCell.height / 2);
		await page.mouse.down();
		await page.mouse.move(fuelCell.x + fuelCell.width / 2 - 10, fuelCell.y + fuelCell.height / 2, { steps: 10 });
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('navigate-from-left-to-right.png');
	});
});
