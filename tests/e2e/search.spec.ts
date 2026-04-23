import { expect, test } from '@playwright/test'

test.describe('Search', () => {
	test('lists products and shows pagination', async ({ page }) => {
		await page.goto('/search')

		await expect(page.getByRole('heading', { name: 'Search', exact: true })).toBeVisible()
		// Form fields exist and are usable.
		await expect(page.getByPlaceholder(/search products/i)).toBeVisible()
		await expect(page.getByRole('combobox')).toBeVisible()

		// Wait for the first card to render (replaces the skeleton).
		await expect(page.locator('a[href^="/products/"]').first()).toBeVisible()

		// Pagination is its own Suspense — at least the prev/next controls show.
		await expect(page.getByRole('navigation', { name: /search results pages/i })).toBeVisible()
	})

	test('clicking a product card opens the detail page', async ({ page }) => {
		await page.goto('/search')

		const firstCard = page.locator('a[href^="/products/"]').first()
		await expect(firstCard).toBeVisible()
		const href = await firstCard.getAttribute('href')
		if (!href) throw new Error('product card had no href')

		await Promise.all([page.waitForURL(new RegExp(`${href}$`)), firstCard.click()])
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('submitting a query updates the URL', async ({ page }) => {
		await page.goto('/search')

		// Wait for the real form to mount (Submit button replaces the skeleton).
		await expect(page.getByRole('button', { name: /^search$/i })).toBeVisible()

		const input = page.getByPlaceholder(/search products/i)
		await input.fill('shirt')
		// Explicit Enter-to-submit. Avoids relying on the 300ms auto-search
		// debounce, which can race the React transition under WebKit.
		await Promise.all([page.waitForURL(/[?&]q=shirt/), input.press('Enter')])
	})
})
