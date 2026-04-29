import { markdownResponse, productDetailMarkdown } from '@/lib/markdown'
import { getProduct, getProductStockCached } from '@/lib/api/products'
import { SITE_URL } from '@/lib/site'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const product = await getProduct(slug)
	if (!product) {
		return new Response('# Not found', {
			status: 404,
			headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
		})
	}
	const stockInfo = await getProductStockCached(product.id)
	return markdownResponse(productDetailMarkdown(product, SITE_URL, stockInfo?.stock ?? null))
}
