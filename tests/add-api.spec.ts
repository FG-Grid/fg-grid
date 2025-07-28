import { test, expect } from '@playwright/test';

test.describe('Add api', () => {
	test('Add 1 item to empty', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			grid.add({
				brand: 'BMW',
				model: '3 Series',
				price: 50000,
				color: 'Black',
				country: 'Germany',
				year: 2023,
				fuelType: 'Diesel',
				electric: false,
				transmission: 'Automatic',
				dateProduction: '12.02.2023'
			})
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-1-empty.png');
	});

	test('Add 2 items to empty', async ({ page }) => {
		await page.goto('http://localhost:3200/test-samples/empty/');

		const gridEl = page.locator('.fg-grid');
		await expect(gridEl).toBeVisible();

		await page.evaluate(() => {
			grid.add([{
				brand: 'BMW',
				model: '3 Series',
				price: 50000,
				color: 'Black',
				country: 'Germany',
				year: 2023,
				fuelType: 'Diesel',
				electric: false,
				transmission: 'Automatic',
				dateProduction: '12.02.2023'
			}, {
				brand: 'Ford',
				model: 'F-150',
				price: 45000,
				color: 'Gray',
				country: 'USA',
				year: 2022,
				fuelType: 'Petrol',
				electric: false,
				transmission: 'Automatic',
				dateProduction: '02.02.2022'
			}])
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('add-2-empty.png');
	});

	test('Add at position 1', async ({ page }) => {
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
			},
			{
				'brand': 'Volvo',
				'model': 'XC90',
				'price': 67125,
				'color': 'Red',
				'country': 'Sweden',
				'year': 2022,
				'fuelType': 'Diesel',
				'electric': false,
				'transmission': 'Automatic'
			},
			{
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
			grid.add([{
				brand: 'BMW',
				model: '3 Series',
				price: 50000,
				color: 'Black',
				country: 'Germany',
				year: 2023,
				fuelType: 'Diesel',
				electric: false,
				transmission: 'Automatic',
				dateProduction: '12.02.2023'
			}, {
				brand: 'Ford',
				model: 'F-150',
				price: 45000,
				color: 'Gray',
				country: 'USA',
				year: 2022,
				fuelType: 'Petrol',
				electric: false,
				transmission: 'Automatic',
				dateProduction: '02.02.2022'
			}], 1)
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('Add at position 1.png');
	});

	test('Add after item', async ({ page }) => {
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
			},
				{
					'brand': 'Volvo',
					'model': 'XC90',
					'price': 67125,
					'color': 'Red',
					'country': 'Sweden',
					'year': 2022,
					'fuelType': 'Diesel',
					'electric': false,
					'transmission': 'Automatic'
				},
				{
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
			const item = grid.getItemById('id-1');

			grid.add([{
				brand: 'BMW',
				model: '3 Series',
				price: 50000,
				color: 'Black',
				country: 'Germany',
				year: 2023,
				fuelType: 'Diesel',
				electric: false,
				transmission: 'Automatic',
				dateProduction: '12.02.2023'
			}, {
				brand: 'Ford',
				model: 'F-150',
				price: 45000,
				color: 'Gray',
				country: 'USA',
				year: 2022,
				fuelType: 'Petrol',
				electric: false,
				transmission: 'Automatic',
				dateProduction: '02.02.2022'
			}], item)
		});

		await page.waitForTimeout(700);

		await expect(await gridEl.screenshot()).toMatchSnapshot('Add after item.png');
	});
});
