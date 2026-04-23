'use server'

import { revalidatePath, updateTag } from 'next/cache'
import * as cartApi from '@/lib/api/cart'
import { getCartToken } from '@/lib/cart'

async function revalidateCart() {
	const token = await getCartToken()
	if (token) updateTag(cartApi.cartCacheTag(token))
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
