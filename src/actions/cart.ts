'use server'

import { revalidatePath } from 'next/cache'
import { addLine, removeLine, setLineQuantity } from '@/lib/cart'

export async function addToCart(slug: string, formData: FormData) {
	const raw = Number(formData.get('quantity') ?? 1)
	const quantity = Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 1
	await addLine(slug, quantity)
	revalidatePath('/', 'layout')
}

export async function updateCartQuantity(slug: string, quantity: number) {
	await setLineQuantity(slug, quantity)
	revalidatePath('/', 'layout')
}

export async function removeFromCart(slug: string) {
	await removeLine(slug)
	revalidatePath('/', 'layout')
}
