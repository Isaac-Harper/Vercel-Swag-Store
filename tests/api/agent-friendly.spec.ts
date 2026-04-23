import { expect, test } from '@playwright/test'

test.describe('Agent-friendly endpoints', () => {
	test('robots.txt advertises sitemap, AI bot rules, and Content-Signal', async ({ request }) => {
		const res = await request.get('/robots.txt')
		expect(res.status()).toBe(200)
		expect(res.headers()['content-type']).toContain('text/plain')

		const body = await res.text()
		expect(body).toMatch(/User-agent: GPTBot[\s\S]*Disallow: \//)
		expect(body).toMatch(/User-agent: ClaudeBot/)
		expect(body).toMatch(/Content-Signal:.*ai-train=no/)
		expect(body).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/)
	})

	test('homepage returns markdown when Accept: text/markdown', async ({ request }) => {
		const res = await request.get('/', { headers: { Accept: 'text/markdown' } })
		expect(res.status()).toBe(200)
		expect(res.headers()['content-type']).toContain('text/markdown')
		expect(res.headers()['x-markdown-tokens']).toMatch(/^\d+$/)

		const body = await res.text()
		expect(body).toMatch(/^# /m) // top-level heading
		expect(body).toMatch(/Featured Products/i)
	})

	test('homepage still returns HTML for browsers (no Accept negotiation)', async ({ request }) => {
		const res = await request.get('/', { headers: { Accept: 'text/html' } })
		expect(res.status()).toBe(200)
		expect(res.headers()['content-type']).toContain('text/html')
	})

	test('product detail markdown includes price and HTML version link', async ({ request }) => {
		// Discover a real slug from the homepage HTML so the test isn't tied to
		// any specific product fixture.
		const home = await request.get('/')
		const html = await home.text()
		const slug = html.match(/href="\/products\/([\w-]+)"/)?.[1]
		test.skip(!slug, 'no product slugs found on homepage')

		const res = await request.get(`/products/${slug}`, {
			headers: { Accept: 'text/markdown' },
		})
		expect(res.status()).toBe(200)
		expect(res.headers()['content-type']).toContain('text/markdown')

		const body = await res.text()
		expect(body).toMatch(/^# /m)
		expect(body).toMatch(/\*\*Price:\*\*/)
		expect(body).toContain(`/products/${slug}`)
	})

	test('Link header advertises sitemap on every route', async ({ request }) => {
		const res = await request.get('/')
		const link = res.headers().link ?? ''
		expect(link).toContain('rel="sitemap"')
		expect(link).toContain('/sitemap.xml')
	})

	test('homepage Link header advertises the markdown alternate', async ({ request }) => {
		const res = await request.get('/')
		const link = res.headers().link ?? ''
		expect(link).toContain('</md>')
		expect(link).toContain('rel="alternate"')
		expect(link).toContain('type="text/markdown"')
		expect(res.headers().vary ?? '').toMatch(/Accept/i)
	})

	test('product detail Link header points to its markdown alternate', async ({
		request,
	}) => {
		const home = await request.get('/')
		const html = await home.text()
		const slug = html.match(/href="\/products\/([\w-]+)"/)?.[1]
		test.skip(!slug, 'no product slugs found on homepage')

		const res = await request.get(`/products/${slug}`)
		const link = res.headers().link ?? ''
		expect(link).toContain(`</md/products/${slug}>`)
		expect(link).toContain('rel="alternate"')
		expect(link).toContain('type="text/markdown"')
	})
})
