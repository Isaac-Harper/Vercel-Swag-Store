import { cacheLife, cacheTag } from 'next/cache'
import { z } from 'zod'
import { apiFetch, ApiError } from '@/lib/api/client'
import { apiProductSchema, getProduct, getProductStockCached } from '@/lib/api/products'
import { clearCartToken, getCartToken, setCartToken } from '@/lib/cart'
import type { AddToCartRequest, CartResponse, UpdateCartItemRequest } from '@/types/api'
import type { CartItem, CartItemWithProduct, CartWithProducts } from '@/types/cart'

/**
 * Cart API client. Uses x-cart-token to identify the user's cart on the backend.
 * The token is stored in an httpOnly cookie via @/lib/cart.
 *
 * Notes on the backend's contract (verified live):
 * - `productId` is the line identifier (no separate line ID). PATCH/DELETE
 *   target `/cart/{productId}`.
 * - The cart response inlines the full product on each line, so no extra
 *   `getProduct` round-trip is needed to render.
 */

const API_URL = process.env.PRODUCTS_API_URL ?? 'https://vercel-swag-store-api.vercel.app/api'
const BYPASS_TOKEN = process.env.VERCEL_API_BYPASS_TOKEN

const apiCartLineSchema = z.object({
	productId: z.string(),
	quantity: z.number(),
	addedAt: z.string(),
	product: apiProductSchema,
	lineTotal: z.number(),
}) satisfies z.ZodType<CartItemWithProduct>

const apiCartSchema = z.object({
	token: z.string(),
	items: z.array(apiCartLineSchema),
	totalItems: z.number(),
	subtotal: z.number(),
	currency: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
}) satisfies z.ZodType<CartWithProducts>

const apiCartResponseSchema = z.object({
	success: z.boolean(),
	data: apiCartSchema,
}) satisfies z.ZodType<CartResponse>

function hydrateLine(line: CartItemWithProduct): CartItem {
	return {
		id: line.productId,
		product: line.product,
		quantity: line.quantity,
		addedAt: line.addedAt,
		lineTotal: line.lineTotal,
	}
}

/**
 * POST /cart/create — issues a new cart and returns the token from the
 * `x-cart-token` response header. Direct fetch (not apiFetch) because we
 * need access to response headers.
 */
async function createCart(): Promise<string> {
	const res = await fetch(`${API_URL}/cart/create`, {
		method: 'POST',
		headers: BYPASS_TOKEN ? { 'x-vercel-protection-bypass': BYPASS_TOKEN } : undefined,
	})
	if (!res.ok) {
		throw new ApiError(res.status, `POST /cart/create → ${res.status}`)
	}
	const token = res.headers.get('x-cart-token')
	if (!token) {
		throw new Error('POST /cart/create did not return x-cart-token header')
	}
	await setCartToken(token)
	return token
}

async function ensureToken(): Promise<string> {
	const existing = await getCartToken()
	if (existing) return existing
	return createCart()
}

/** Tag for invalidating a specific cart's cached fetch. */
export function cartCacheTag(token: string): string {
	return `cart:${token}`
}

type CartSnapshot = {
	items: CartItem[]
	totalItems: number
	subtotal: number
}

/**
 * Cached cart fetch keyed by token. Returns the items + server-computed
 * totals so callers (`getCart`, `getCartCount`, `getCartWithStock`) share a
 * single underlying fetch. Null = backend has no record of the token (404)
 * so the caller can clean the cookie up — we can't write cookies inside
 * `'use cache'`.
 */
async function fetchCartByToken(token: string): Promise<CartSnapshot | null> {
	'use cache'

	cacheLife('minutes')
	cacheTag(cartCacheTag(token))

	try {
		const raw = await apiFetch<unknown>('/cart', {
			headers: { 'x-cart-token': token },
		})
		const parsed = apiCartResponseSchema.parse(raw)
		return {
			items: parsed.data.items.map(hydrateLine),
			totalItems: parsed.data.totalItems,
			subtotal: parsed.data.subtotal,
		}
	} catch (err) {
		if (err instanceof ApiError && err.status === 404) return null
		throw err
	}
}

async function getCartSnapshot(): Promise<CartSnapshot> {
	const empty: CartSnapshot = { items: [], totalItems: 0, subtotal: 0 }
	const token = await getCartToken()
	if (!token) return empty
	const snapshot = await fetchCartByToken(token)
	if (snapshot === null) {
		await clearCartToken()
		return empty
	}
	return snapshot
}

export async function getCart(): Promise<CartItem[]> {
	return (await getCartSnapshot()).items
}

export async function getCartCount(): Promise<number> {
	return (await getCartSnapshot()).totalItems
}

/**
 * Cart with real-time stock per line. Used by the cart UI to gate the
 * `+` button and by checkout to validate before charging. Stock is fetched
 * uncached in parallel — adds one extra round trip per line.
 */
export async function getCartWithStock(): Promise<CartItem[]> {
	const items = await getCart()
	if (items.length === 0) return items
	const stocks = await Promise.all(items.map((item) => getProductStockCached(item.product.id)))
	return items.map((item, i) => ({ ...item, stock: stocks[i]?.stock }))
}

export async function addToCart(slug: string, quantity: number): Promise<void> {
	if (quantity <= 0) return
	// Backend's POST /cart accepts productId. Our slug-based actions hand us a
	// slug — look up the product to get its id.
	const product = await getProduct(slug)
	if (!product) return
	const token = await ensureToken()
	const body: AddToCartRequest = { productId: product.id, quantity }
	await apiFetch('/cart', {
		method: 'POST',
		headers: { 'x-cart-token': token },
		body: JSON.stringify(body),
	})
}

export async function updateCartItem(productId: string, quantity: number): Promise<void> {
	if (quantity <= 0) {
		await removeFromCart(productId)
		return
	}
	const token = await getCartToken()
	if (!token) return
	const body: UpdateCartItemRequest = { quantity }
	await apiFetch(`/cart/${encodeURIComponent(productId)}`, {
		method: 'PATCH',
		headers: { 'x-cart-token': token },
		body: JSON.stringify(body),
	})
}

export async function removeFromCart(productId: string): Promise<void> {
	const token = await getCartToken()
	if (!token) return
	await apiFetch(`/cart/${encodeURIComponent(productId)}`, {
		method: 'DELETE',
		headers: { 'x-cart-token': token },
	})
}

/**
 * Drops the cart token. The backend cart is orphaned (intentional — the
 * backend can GC unused carts on its own schedule). Next add-to-cart creates
 * a fresh cart. If the backend ever exposes a DELETE /cart, swap in that call.
 */
export async function clearCart(): Promise<void> {
	await clearCartToken()
}
