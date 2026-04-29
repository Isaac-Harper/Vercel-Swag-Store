'use server'

import { updateTag } from 'next/cache'
import * as cartApi from '@/lib/api/cart'
import { getCartToken } from '@/lib/cart'

async function revalidateCart() {
	const token = await getCartToken()
	if (token) updateTag(cartApi.cartCacheTag(token))
}

export type AddToCartState = { ok: true } | { ok: false; reason: 'unknown-product' } | null

export async function addToCart(
	slug: string,
	_prev: AddToCartState,
	formData: FormData
): Promise<AddToCartState> {
	const raw = Number(formData.get('quantity') ?? 1)
	const quantity = Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 1
	const result = await cartApi.addToCart(slug, quantity)
	if (result.ok) await revalidateCart()
	return result
}

/**
 * Result of a non-form cart mutation. Callers (currently `<CartView>`) react
 * to `{ ok: false }` by surfacing an inline alert; the optimistic state
 * reverts on its own once revalidation lands.
 */
export type CartMutationResult = { ok: true } | { ok: false; reason: 'failed' }

export async function updateCartQuantity(
	itemId: string,
	quantity: number
): Promise<CartMutationResult> {
	try {
		await cartApi.updateCartItem(itemId, quantity)
		await revalidateCart()
		return { ok: true }
	} catch {
		// Force a refetch so the optimistic UI reverts to authoritative server state.
		await revalidateCart()
		return { ok: false, reason: 'failed' }
	}
}

export async function removeFromCart(itemId: string): Promise<CartMutationResult> {
	try {
		await cartApi.removeFromCart(itemId)
		await revalidateCart()
		return { ok: true }
	} catch {
		await revalidateCart()
		return { ok: false, reason: 'failed' }
	}
}
