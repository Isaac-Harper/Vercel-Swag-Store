/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [{ hostname: 'cdn.raster.app' }, { hostname: 'rstr.in' }],
		formats: ['image/avif', 'image/webp'],
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	async headers() {
		const headers = []

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
