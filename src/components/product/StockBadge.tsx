import { getProductStockCached } from '@/lib/api/products'

/**
 * Async server component — fetches stock for a product and renders an
 * absolutely-positioned badge inside a Card's image container. Returns null
 * (no badge) for products with healthy stock. Wrap in `<Suspense>` so the
 * surrounding card paints immediately.
 */
export async function StockBadge({ productId }: { productId: string }) {
	const info = await getProductStockCached(productId)
	if (!info) return null

	if (info.stock === 0) {
		return (
			<>
				<div className="absolute inset-0 rounded bg-white/60" aria-hidden />
				<span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
					Out of stock
				</span>
			</>
		)
	}

	if (info.lowStock) {
		return (
			<span className="absolute left-2 top-2 rounded bg-amber-700 px-2 py-1 text-xs font-medium text-white">
				Only {info.stock} left
			</span>
		)
	}

	return null
}
