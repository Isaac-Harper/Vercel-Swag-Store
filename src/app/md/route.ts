import { markdownResponse, productLineMarkdown } from '@/lib/markdown'
import { listProducts } from '@/lib/api/products'
import { getStoreConfig } from '@/lib/api/store'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export async function GET() {
	const [config, featured] = await Promise.all([
		getStoreConfig(),
		listProducts({ featured: true }),
	])

	const lines = [
		`# ${config.storeName}`,
		'',
		config.seo.defaultDescription,
		'',
		'## Featured Products',
		'',
		...featured.map((p) => productLineMarkdown(p, SITE_URL)),
		'',
		'## Browse',
		'',
		`- All products: ${SITE_URL}/search`,
	]
	return markdownResponse(lines.join('\n'))
}
