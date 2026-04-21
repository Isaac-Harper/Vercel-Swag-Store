import type { MetadataRoute } from 'next'
import { products } from '@/data/products'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date()
	const staticPaths: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
		{ url: `${SITE_URL}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
	]
	const productPaths: MetadataRoute.Sitemap = products.map((p) => ({
		url: `${SITE_URL}/products/${p.slug}`,
		lastModified: now,
		changeFrequency: 'weekly',
		priority: 0.9,
	}))
	return [...staticPaths, ...productPaths]
}
