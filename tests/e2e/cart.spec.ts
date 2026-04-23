import { expect, test } from '@playwright/test'

test.describe('Cart', () => {
	test('add-to-cart bumps the header badge optimistically', async ({ page }) => {
		await page.goto('/search')

		const firstCard = page.locator('a[href^="/products/"]').first()
		await expect(firstCard).toBeVisible()
		const href = await firstCard.getAttribute('href')
		if (!href) throw new Error('product card had no href')

		await Promise.all([page.waitForURL(new RegExp(`${href}$`)), firstCard.click()])

		// Product detail — `<AddToCartForm>` renders once stock resolves.
		const addBtn = page.getByRole('button', { name: /add to cart/i })
		await expect(addBtn).toBeVisible({ timeout: 10_000 })
		await addBtn.click()

		// Header cart link contains the badge — confirm it now shows a count of 1.
		const cartLink = page.locator('header a[href="/cart"]')
		await expect(cartLink).toContainText('1')
	})

	test('opening /cart shows the drawer modal', async ({ page }) => {
		await page.goto('/')
		// Wait for hero so we know the layout is hydrated before clicking.
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

		await page.locator('header a[href="/cart"]').click()
		// Radix dialog uses role="dialog" with the title as accessible name.
		await expect(page.getByRole('dialog', { name: /cart/i })).toBeVisible()
	})
})
