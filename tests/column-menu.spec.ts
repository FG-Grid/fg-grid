import { test, expect } from '@playwright/test';

test.describe('Column menu', () => {
	test('Column menu: hide columns', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const menu = await page.locator('.fg-header-cell[col-id="model"] .fg-header-cell-menu').boundingBox();

		await page.mouse.move(menu.x + menu.width / 2, menu.y + menu.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const menuItemBrand = await page.locator('.fg-columns-menu div[col-index="1"]').boundingBox();

		await page.mouse.move(menuItemBrand.x + menuItemBrand.width / 2, menuItemBrand.y + menuItemBrand.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const menuItemPrice = await page.locator('.fg-columns-menu div[col-index="5"]').boundingBox();

		await page.mouse.move(menuItemPrice.x + menuItemPrice.width / 2, menuItemPrice.y + menuItemPrice.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('column-menu-hide-columns.png');
	});

	test('Column menu: hide show columns', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/100-rows/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		const menu = await page.locator('.fg-header-cell[col-id="model"] .fg-header-cell-menu').boundingBox();

		await page.mouse.move(menu.x + menu.width / 2, menu.y + menu.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const menuItemBrand = await page.locator('.fg-columns-menu div[col-index="1"]').boundingBox();

		await page.mouse.move(menuItemBrand.x + menuItemBrand.width / 2, menuItemBrand.y + menuItemBrand.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		const menuItemPrice = await page.locator('.fg-columns-menu div[col-index="5"]').boundingBox();

		await page.mouse.move(menuItemPrice.x + menuItemPrice.width / 2, menuItemPrice.y + menuItemPrice.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await page.mouse.move(menuItemBrand.x + menuItemBrand.width / 2, menuItemBrand.y + menuItemBrand.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await page.mouse.move(menuItemPrice.x + menuItemPrice.width / 2, menuItemPrice.y + menuItemPrice.height / 2);
		await page.mouse.down();
		await page.mouse.up();

		await page.waitForTimeout(1000);

		await expect(await gridEl.screenshot()).toMatchSnapshot('column-menu-hide-show-columns.png');
	});
});
