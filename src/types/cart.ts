import type { Product } from '@/types/product'

/**
 * Cart line as returned by the cart API. Inlines the full product so a single
 * `/cart` call has everything the UI needs to render — no follow-up product
 * lookup. `lineTotal` is `product.price * quantity`, in cents.
 */
export type CartItemWithProduct = {
	productId: string
	quantity: number
	addedAt: string
	product: Product
	lineTotal: number
}

/**
 * Full cart envelope as returned by `/cart`. `subtotal` and `totalItems` are
 * server-computed snapshots in cents / count. Use them in places that render
 * directly from the API response; in optimistic UIs, prefer reducing over
 * `items` since these go stale during in-flight mutations.
 */
export type CartWithProducts = {
	token: string
	items: CartItemWithProduct[]
	totalItems: number
	subtotal: number
	currency: string
	createdAt: string
	updatedAt: string
}

/**
 * Local cart line. `id` flattens `productId` since the backend uses it as the
 * line identifier (PATCH/DELETE target). `lineTotal` and `addedAt` are passed
 * through from the API so the UI doesn't have to recompute totals or invent
 * an order. `stock` is populated by `getCartWithStock` when known — undefined
 * means "stock check failed or not yet fetched", treat as unlimited for UI.
 */
export type CartItem = {
	id: string
	product: Product
	quantity: number
	addedAt: string
	lineTotal: number
	stock?: number
}
