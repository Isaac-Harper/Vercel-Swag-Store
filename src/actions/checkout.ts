'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'
import { cartCacheTag, clearCart, getCart } from '@/lib/api/cart'
import { createOrder } from '@/lib/api/orders'
import { getProductStock } from '@/lib/api/products'
import { getCartToken } from '@/lib/cart'
import { US_STATE_NAMES } from '@/data/usStates'

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
		.refine((v) => US_STATE_NAMES.includes(v), 'Pick a valid US state'),
	'postal-code': z.string().regex(/^\d{5}(-\d{4})?$/, 'Use 12345 or 12345-6789'),
	country: z.string().trim().min(1, 'Required').max(60),
	tel: z
		.string()
		.regex(/^[\d\s\-+()]{7,20}$/, 'Enter a valid phone number')
		.optional()
		.or(z.literal('')),
	// Card data (PAN, expiry, CVC) is tokenized client-side by `tokenize()` in
	// CheckoutView and never reaches this action — only the opaque processor
	// token plus display-safe metadata. The cardholder name is the lone
	// non-tokenized field; processors generally accept it as billing metadata.
	'cc-name': z.string().trim().min(1, 'Required').max(100),
	'payment-token': z.string().regex(/^tok_/, 'Invalid payment token'),
	'payment-last4': z.string().regex(/^\d{4}$/, 'Invalid card metadata'),
	'payment-brand': z.string().trim().min(1).max(20),
})

export type CheckoutState = {
	ok: boolean
	formError?: string
}

export async function submitCheckout(
	_prev: CheckoutState,
	formData: FormData
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
	const stocks = await Promise.all(items.map((item) => getProductStock(item.product.id)))
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
				token: parsed.data['payment-token'],
				cardholderName: parsed.data['cc-name'],
				last4: parsed.data['payment-last4'],
				brand: parsed.data['payment-brand'],
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
