import { markdownResponse, productDetailMarkdown } from '@/lib/markdown'
import { getProduct, getProductStockForListing } from '@/lib/api/products'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	const { slug } = await params
	const product = await getProduct(slug)
	if (!product) {
		return new Response('# Not found', {
			status: 404,
			headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
		})
	}
	const stockInfo = await getProductStockForListing(product.id)
	return markdownResponse(productDetailMarkdown(product, SITE_URL, stockInfo?.stock ?? null))
}
