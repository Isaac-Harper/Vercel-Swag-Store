import 'server-only'

import { cents } from '@/types/money'
import type { CreateOrderInput, OrderResult } from '@/types/order'

export async function createOrder(input: CreateOrderInput): Promise<OrderResult> {
	// TODO: replace with real backend call
	// - Charge payment via processor (Stripe, Adyen, etc.)
	// - Persist order + line items to DB
	// - Decrement stock atomically (handle race conditions / oversells)
	// - Send confirmation email
	// - Return canonical order with id, totals, fulfillment ETA, etc.
	//
	// return apiFetch<OrderResult>('/orders', {
	//   method: 'POST',
	//   body: JSON.stringify(input),
	// })

	// Mock: even-last-digit cards approve, odd decline (matches existing UI behavior).
	const lastDigit = Number(input.payment.cardNumber.replace(/\s/g, '').slice(-1))
	if (lastDigit % 2 !== 0) {
		return { status: 'declined', reason: 'Payment declined. Please try a different card.' }
	}
	return { status: 'paid', orderId: `mock_${Date.now()}`, total: cents(0), items: [] }
}
