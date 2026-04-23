/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	// experimental.optimizeCss removed — Critters was suspected of stripping
	// the meta description in some Lighthouse runs (SEO 92 -> 100 swing). The
	// 70ms render-blocking CSS hit is acceptable cost for a stable SEO signal.
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{ hostname: 'cdn.raster.app' },
			{ hostname: 'rstr.in' },
			{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
		],
		formats: ['image/avif', 'image/webp'],
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
		]

		const headers = [{ source: '/:path*', headers: securityHeaders }]

		if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
			headers.push({
				headers: [
					{
						key: 'X-Robots-Tag',
						value: 'noindex',
					},
				],
				source: '/:path*',
			})
		}

		return headers
	},
}

module.exports = nextConfig
