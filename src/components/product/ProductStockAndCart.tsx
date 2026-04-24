import { AddToCartForm } from '@/components/cart/AddToCartForm'
import { getProductStock } from '@/lib/api/products'
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
	// Detail page spec requires real-time stock, so bypass the hour-cached
	// variant used by listings. The parent wraps this in Suspense so the
	// live read streams in after the prerendered shell.
	const stockInfo = await getProductStock(id)
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
