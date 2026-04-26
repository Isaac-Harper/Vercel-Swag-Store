import { markdownResponse, productLineMarkdown } from '@/lib/markdown'
import { listProducts } from '@/lib/api/products'
import { getStoreConfig } from '@/lib/api/store'
import { SITE_URL } from '@/lib/site'

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
