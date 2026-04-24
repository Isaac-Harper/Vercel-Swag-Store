import { AddToCartForm } from '@/components/cart/AddToCartForm'
import { getProductStockForListing } from '@/lib/api/products'
import type { StockInfo } from '@/types/stock'

function getStockMessage(info: StockInfo | null): string {
	if (!info || info.stock === 0) return 'Out of stock'
	if (info.lowStock) return `Only ${info.stock} left in stock`
	return 'In stock'
}

export async function ProductStockAndCart({
	id,
	slug,
}: {
	id: string
	slug: string
}) {
	// Keyed by `id` (not `slug`) so this shares the cache entry that
	// `<SearchResultsList>` / `<Featured>` populate — otherwise the detail
	// page would hit the backend separately and show a different random
	// value than the card the user clicked from. Checkout uses the uncached
	// `getProductStock` for an authoritative read at charge time.
	const stockInfo = await getProductStockForListing(id)
	const stock = stockInfo?.stock ?? 0
	const message = getStockMessage(stockInfo)

	return (
		<>
			<p className={`text-sm ${stock === 0 ? 'text-red-600' : 'text-gray-600'}`}>
				{message}
			</p>
			<AddToCartForm slug={slug} stock={stock} />
		</>
	)
}
