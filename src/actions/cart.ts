'use server'

import { revalidatePath, updateTag } from 'next/cache'
import * as cartApi from '@/lib/api/cart'
import { getCartToken } from '@/lib/cart'
import { CART_STOCK_CACHE_TAG } from '@/lib/api/products'

async function revalidateCart() {
	const token = await getCartToken()
	if (token) updateTag(cartApi.cartCacheTag(token))
	// Refresh cart-scoped stock so `atStockCap` (the `+` gate and "Only N left"
	// badge) reflects the latest backend reading the moment the cart changes,
	// rather than holding the 5s cache. Listing stock keeps its minutes-cache.
	updateTag(CART_STOCK_CACHE_TAG)
	revalidatePath('/', 'layout')
}

export async function addToCart(slug: string, formData: FormData) {
	const raw = Number(formData.get('quantity') ?? 1)
	const quantity = Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 1
	await cartApi.addToCart(slug, quantity)
	await revalidateCart()
}

export async function updateCartQuantity(itemId: string, quantity: number) {
	await cartApi.updateCartItem(itemId, quantity)
	await revalidateCart()
}

export async function removeFromCart(itemId: string) {
	await cartApi.removeFromCart(itemId)
	await revalidateCart()
}
