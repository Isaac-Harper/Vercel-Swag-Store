import type { Cents } from '@/types/money'
import type { Product } from '@/types/product'

/**
 * Cart line as returned by the cart API. Inlines the full product so a single
 * `/cart` call has everything the UI needs to render — no follow-up product
 * lookup.
 */
export type CartItemWithProduct = {
	productId: string
	quantity: number
	addedAt: string
	product: Product
	lineTotal: Cents
}

/**
 * Full cart envelope as returned by `/cart`. `subtotal` and `totalItems` are
 * server-computed snapshots. Use them in places that render directly from the
 * API response; in optimistic UIs, prefer reducing over `items` since these
 * go stale during in-flight mutations.
 */
export type CartWithProducts = {
	token: string
	items: CartItemWithProduct[]
	totalItems: number
	subtotal: Cents
	currency: string
	createdAt: string
	updatedAt: string
}

/**
 * Local cart line. `id` flattens `productId` since the backend uses it as the
 * line identifier (PATCH/DELETE target). `lineTotal` and `addedAt` are passed
 * through from the API so the UI doesn't have to recompute totals or invent
 * an order. Stock lives in a separate `Map<productId, number>` streamed via
 * `CartStockProvider` so items render before stock resolves.
 */
export type CartItem = {
	id: string
	product: Product
	quantity: number
	addedAt: string
	lineTotal: Cents
}
