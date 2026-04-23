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

		// `force: true` because the `<Image fill>` sits absolutely on top of the
		// `<Link>`, and WebKit's hit-test reports the image as the topmost
		// element. The click still navigates (the image is inside the link), but
		// Playwright's actionability check rejects it without `force`.
		await Promise.all([
			page.waitForURL(new RegExp(`${href}$`)),
			firstCard.click({ force: true }),
		])
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
	})

	test('submitting a query updates the URL', async ({ page }) => {
		await page.goto('/search')

		const submitBtn = page.getByRole('button', { name: /^search$/i })
		await expect(submitBtn).toBeVisible()

		const input = page.getByPlaceholder(/search products/i)
		// `pressSequentially` types real keystrokes — `fill` in WebKit sometimes
		// sets the DOM value without triggering React's synthetic `onChange`, so
		// the component's `q` state stays empty and submit pushes `/search` with
		// no query string. Submit via Enter for the same WebKit-click reason.
		await input.pressSequentially('shirt')
		await Promise.all([page.waitForURL(/[?&]q=shirt/), input.press('Enter')])
	})
})
