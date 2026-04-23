'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { cartCacheTag, clearCart, getCart } from '@/lib/api/cart'
import { createOrder } from '@/lib/api/orders'
import { getProductStock } from '@/lib/api/products'
import { getCartToken } from '@/lib/cart'
import { usStates } from '@/data/usStates'

const stateNames = usStates.map((s) => s.name)

const checkoutSchema = z.object({
	email: z.email({ message: 'Enter a valid email' }),
	'given-name': z.string().trim().min(1, 'Required').max(50),
	'family-name': z.string().trim().min(1, 'Required').max(50),
	'address-line1': z.string().trim().min(1, 'Required').max(100),
	'address-line2': z.string().trim().max(100).optional(),
	'address-level2': z.string().trim().min(1, 'Required').max(60),
	'address-level1': z
		.string()
		.trim()
		.refine((v) => stateNames.includes(v), 'Pick a valid US state'),
	'postal-code': z
		.string()
		.regex(/^\d{5}(-\d{4})?$/, 'Use 12345 or 12345-6789'),
	country: z.string().trim().min(1, 'Required').max(60),
	tel: z
		.string()
		.regex(/^[\d\s\-+()]{7,20}$/, 'Enter a valid phone number')
		.optional()
		.or(z.literal('')),
	'cc-number': z
		.string()
		.refine(
			(v) => /^\d{13,19}$/.test(v.replace(/\s+/g, '')),
			'Enter a 13–19 digit card number',
		),
	'cc-name': z.string().trim().min(1, 'Required').max(100),
	'cc-exp': z
		.string()
		.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY')
		.refine((v) => {
			const [mm, yy] = v.split('/').map(Number)
			const now = new Date()
			const currentYY = now.getFullYear() % 100
			const currentMonth = now.getMonth() + 1
			return yy > currentYY || (yy === currentYY && mm >= currentMonth)
		}, 'Card is expired'),
	'cc-csc': z.string().regex(/^\d{3,4}$/, '3 or 4 digits'),
})

export type CheckoutState = {
	ok: boolean
	formError?: string
}

export async function submitCheckout(
	_prev: CheckoutState,
	formData: FormData,
): Promise<CheckoutState> {
	const items = await getCart()
	if (items.length === 0) {
		return { ok: false, formError: 'Your cart is empty.' }
	}

	const parsed = checkoutSchema.safeParse(Object.fromEntries(formData))
	if (!parsed.success) {
		return {
			ok: false,
			formError: 'Please check the highlighted fields and try again.',
		}
	}

	// Authoritative stock check before charging — guards against client races and
	// inventory dropping between the cart view and the order being placed.
	const stocks = await Promise.all(
		items.map((item) => getProductStock(item.product.id)),
	)
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const available = stocks[i]?.stock
		if (available !== undefined && available < item.quantity) {
			return {
				ok: false,
				formError:
					available === 0
						? `${item.product.name} is sold out.`
						: `Only ${available} of ${item.product.name} left — please update your cart.`,
			}
		}
	}

	// Place the order and capture the cart token in parallel — the token is
	// only needed for cache invalidation after `clearCart` drops the cookie.
	const [result, oldToken] = await Promise.all([
		createOrder({
			email: parsed.data.email,
			shipping: {
				givenName: parsed.data['given-name'],
				familyName: parsed.data['family-name'],
				addressLine1: parsed.data['address-line1'],
				addressLine2: parsed.data['address-line2'],
				city: parsed.data['address-level2'],
				state: parsed.data['address-level1'],
				postalCode: parsed.data['postal-code'],
				country: parsed.data.country,
				phone: parsed.data.tel || undefined,
			},
			payment: {
				cardNumber: parsed.data['cc-number'],
				cardholderName: parsed.data['cc-name'],
				expiry: parsed.data['cc-exp'],
				cvc: parsed.data['cc-csc'],
			},
		}),
		getCartToken(),
	])

	if (result.status === 'declined') {
		return { ok: false, formError: result.reason }
	}

	await clearCart()
	if (oldToken) updateTag(cartCacheTag(oldToken))
	revalidatePath('/', 'layout')

	return { ok: true }
}
