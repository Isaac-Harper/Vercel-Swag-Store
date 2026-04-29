import { expect, test } from '@playwright/test'

test.describe('Cart', () => {
	test('add-to-cart bumps the header badge optimistically', async ({ page }) => {
		await page.goto('/search')

		const firstCard = page.locator('a[href^="/products/"]').first()
		await expect(firstCard).toBeVisible()
		const href = await firstCard.getAttribute('href')
		if (!href) throw new Error('product card had no href')

		// `force: true` — see search.spec.ts for the same WebKit hit-test issue
		// (the `<Image fill>` reports as the topmost element over the link).
		await Promise.all([page.waitForURL(new RegExp(`${href}$`)), firstCard.click({ force: true })])

		// Wait for the detail page to actually paint before hunting for the
		// add-to-cart button — `<ProductStockAndCart>` is inside Suspense and
		// streams in after the title.
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

		// Wait for the form's submit button to render (Suspense resolves).
		// Match by name pattern so we hit the add-to-cart button specifically,
		// not the Search form's submit button (which can linger in the DOM
		// from the previous page via Next.js's router cache). When stock is 0
		// the button reads "Out of stock" — we skip the click test, since the
		// form's purpose is exercised only by an in-stock product.
		const submitBtn = page.getByRole('button', {
			name: /^(add to cart|out of stock)$/i,
		})
		await expect(submitBtn).toBeVisible({ timeout: 15_000 })

		const label = (await submitBtn.textContent()) ?? ''
		test.skip(
			/out of stock/i.test(label),
			'first product is currently out of stock — cannot exercise add-to-cart'
		)

		await submitBtn.click()

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
