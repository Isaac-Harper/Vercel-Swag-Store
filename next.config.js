/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	// experimental.optimizeCss removed — Critters was suspected of stripping
	// the meta description in some Lighthouse runs (SEO 92 -> 100 swing). The
	// 70ms render-blocking CSS hit is acceptable cost for a stable SEO signal.
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'cdn.raster.app' },
			{ protocol: 'https', hostname: 'rstr.in' },
			{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
		],
		formats: ['image/avif', 'image/webp'],
		contentDispositionType: 'attachment',
		// Optimized variants are kept for 31 days. Source product images on
		// vercel-storage are immutable per URL, so re-fetching from origin is
		// pure waste. Bust by changing the image URL (new upload).
		minimumCacheTTL: 60 * 60 * 24 * 31,
	},
	async headers() {
		// CSP intentionally omitted — strict CSP requires nonce-per-request from
		// middleware/proxy, which conflicted with the Vercel toolbar's inline
		// scripts and brought no real benefit for a no-UGC swag store. Bring it
		// back via `proxy.ts` if that calculus changes (payment iframes, reviews,
		// etc.).
		const securityHeaders = [
			{
				key: 'Strict-Transport-Security',
				value: 'max-age=31536000; includeSubDomains; preload',
			},
			{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
			{ key: 'X-Content-Type-Options', value: 'nosniff' },
			{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
			{
				key: 'Permissions-Policy',
				value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
			},
			// Advertise the sitemap to crawlers/agents that look at HTTP Link
			// headers (RFC 8288) instead of (or in addition to) parsing robots.txt.
			{ key: 'Link', value: '</sitemap.xml>; rel="sitemap"' },
		]

		const headers = [{ source: '/:path*', headers: securityHeaders }]

		// Per-route Link headers advertising the markdown alternate of each
		// agent-facing page (RFC 8288 + RFC 6249-style content negotiation hint).
		// Browsers ignore these; AI crawlers / SDKs that resolve `rel="alternate"
		// type=text/markdown" can fetch the cleaner text version directly.
		// `Vary: Accept` keeps shared caches from serving HTML for the markdown
		// request and vice-versa.
		const markdownAlternates = [
			{ source: '/', md: '/md' },
			{ source: '/search', md: '/md/search' },
			{ source: '/products/:slug', md: '/md/products/:slug' },
		]
		// Next.js overwrites same-key headers when multiple `source` rules match,
		// so the wildcard sitemap Link above gets replaced on these routes. Merge
		// both link-values into a single comma-separated Link header here.
		for (const { source, md } of markdownAlternates) {
			headers.push({
				source,
				headers: [
					{
						key: 'Link',
						value: `<${md}>; rel="alternate"; type="text/markdown", </sitemap.xml>; rel="sitemap"`,
					},
					{ key: 'Vary', value: 'Accept' },
				],
			})
		}

		// Block search engines from indexing preview / development deployments.
		// Production keeps the default (indexable) behavior.
		if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
			headers.push({
				source: '/:path*',
				headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
			})
		}

		return headers
	},
}

module.exports = nextConfig
