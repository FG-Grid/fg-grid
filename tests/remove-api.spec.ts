import { test, expect } from '@playwright/test';

test.describe('Remove api', () => {
	test('Remove array', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			grid.add([{
				'brand': 'BMW',
				'model': 'X5',
				'price': 64281,
				'color': 'Black',
				'country': 'Germany',
				'year': 2020,
				'fuelType': 'Electric',
				'electric': false,
				'transmission': 'Automatic'
			},{
				'brand': 'Volvo',
				'model': 'XC90',
				'price': 67125,
				'color': 'Red',
				'country': 'Sweden',
				'year': 2022,
				'fuelType': 'Diesel',
				'electric': false,
				'transmission': 'Automatic'
			},{
				'brand': 'Toyota',
				'model': 'Highlander',
				'price': 48136,
				'color': 'Red',
				'country': 'Japan',
				'year': 2021,
				'fuelType': 'Electric',
				'electric': false,
				'transmission': 'Automatic'
			}])
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			const item1 = grid.getItemById('id-1');
			const item2 = grid.getItemById('id-2');

			grid.remove([item1, item2]);
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('remove-array.png');
	});

	test('Remove 1 item', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			grid.add([{
				'brand': 'BMW',
				'model': 'X5',
				'price': 64281,
				'color': 'Black',
				'country': 'Germany',
				'year': 2020,
				'fuelType': 'Electric',
				'electric': false,
				'transmission': 'Automatic'
			},{
				'brand': 'Volvo',
				'model': 'XC90',
				'price': 67125,
				'color': 'Red',
				'country': 'Sweden',
				'year': 2022,
				'fuelType': 'Diesel',
				'electric': false,
				'transmission': 'Automatic'
			},{
				'brand': 'Toyota',
				'model': 'Highlander',
				'price': 48136,
				'color': 'Red',
				'country': 'Japan',
				'year': 2021,
				'fuelType': 'Electric',
				'electric': false,
				'transmission': 'Automatic'
			}])
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			const item1 = grid.getItemById('id-1');

			grid.remove(item1);
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('remove-1-item.png');
	});

	test('Remove by id', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			grid.add([{
				'brand': 'BMW',
				'model': 'X5',
				'price': 64281,
				'color': 'Black',
				'country': 'Germany',
				'year': 2020,
				'fuelType': 'Electric',
				'electric': false,
				'transmission': 'Automatic'
			},{
				'brand': 'Volvo',
				'model': 'XC90',
				'price': 67125,
				'color': 'Red',
				'country': 'Sweden',
				'year': 2022,
				'fuelType': 'Diesel',
				'electric': false,
				'transmission': 'Automatic'
			},{
				'brand': 'Toyota',
				'model': 'Highlander',
				'price': 48136,
				'color': 'Red',
				'country': 'Japan',
				'year': 2021,
				'fuelType': 'Electric',
				'electric': false,
				'transmission': 'Automatic'
			}])
		});

		await page.waitForTimeout(700);

		await page.evaluate(() => {
			grid.remove('id-1');
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('remove-by-id.png');
	});
});
