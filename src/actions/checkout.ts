'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { usStates } from '@/data/usStates'
import { clearCart, getCartItems } from '@/lib/cart'

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
	const items = await getCartItems()
	if (items.length === 0) {
		return { ok: false, formError: 'Your cart is empty.' }
	}

	const result = checkoutSchema.safeParse(Object.fromEntries(formData))
	if (!result.success) {
		return {
			ok: false,
			formError: 'Please check the highlighted fields and try again.',
		}
	}

	const digits = result.data['cc-number'].replace(/\s/g, '')
	const lastDigit = Number(digits.slice(-1))
	const accepted = lastDigit % 2 === 0

	if (!accepted) {
		return {
			ok: false,
			formError: 'Payment declined. Please try a different card.',
		}
	}

	// TODO: persist order to DB, charge card via payment processor, send email.
	// For now we just clear the cart on a successful "charge".
	await clearCart()
	revalidatePath('/', 'layout')

	return { ok: true }
}
