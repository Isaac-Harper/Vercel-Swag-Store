import type { MetadataRoute } from 'next'
import { listProducts } from '@/lib/api/products'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

// Captured at module load (build time during prerender). Cache Components
// rejects `new Date()` inside the request path, so this stays at module scope —
// every build refreshes the timestamp.
const BUILD_TIME = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await listProducts()
	const staticPaths: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/`, lastModified: BUILD_TIME, changeFrequency: 'weekly', priority: 1 },
		{ url: `${SITE_URL}/search`, lastModified: BUILD_TIME, changeFrequency: 'weekly', priority: 0.8 },
	]
	const productPaths: MetadataRoute.Sitemap = products.map((p) => ({
		url: `${SITE_URL}/products/${p.slug}`,
		lastModified: BUILD_TIME,
		changeFrequency: 'weekly',
		priority: 0.9,
	}))
	return [...staticPaths, ...productPaths]
}
