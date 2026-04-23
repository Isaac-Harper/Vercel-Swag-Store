import { expect, test } from '@playwright/test'

test.describe('Home', () => {
	test('renders the hero and at least one featured product', async ({ page }) => {
		await page.goto('/')

		// Hero copy is server-rendered from `<Hero>`.
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

		// Featured grid streams in via Suspense — wait for cards to appear.
		const featuredHeading = page.getByRole('heading', { name: /featured products/i })
		await expect(featuredHeading).toBeVisible()

		const featuredSection = page.locator('section').filter({ has: featuredHeading })
		await expect(featuredSection.locator('a[href^="/products/"]')).not.toHaveCount(0)
	})

	test('header navigates to search', async ({ page }) => {
		await page.goto('/')
		// Wait for the hero before clicking — proves the page is hydrated enough
		// for `<Link>`'s client navigation handler to be attached.
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

		const searchLink = page.getByRole('link', { name: 'Search', exact: true })
		await Promise.all([page.waitForURL(/\/search/), searchLink.click()])

		await expect(page.getByRole('heading', { name: 'Search', exact: true })).toBeVisible()
	})
})
