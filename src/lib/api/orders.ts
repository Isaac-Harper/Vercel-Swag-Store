import 'server-only'

import { cents } from '@/types/money'
import type { CreateOrderInput, OrderResult } from '@/types/order'

export async function createOrder(input: CreateOrderInput): Promise<OrderResult> {
	// TODO: replace with real backend call
	// - Charge payment via processor using `input.payment.token`
	//   (the raw PAN/CVC/expiry never reach this server — see PaymentToken)
	// - Persist order + line items to DB
	// - Decrement stock atomically (handle race conditions / oversells)
	// - Send confirmation email
	// - Return canonical order with id, totals, fulfillment ETA, etc.
	//
	// return apiFetch<OrderResult>('/orders', {
	//   method: 'POST',
	//   body: JSON.stringify(input),
	// })

	// Mock: the client tokenizer (`tokenize()` in CheckoutView) encodes the
	// approve/decline outcome into the token prefix. Production processors
	// return the outcome from their charge API instead.
	if (input.payment.token.includes('_declined_')) {
		return { status: 'declined', reason: 'Payment declined. Please try a different card.' }
	}
	return { status: 'paid', orderId: `mock_${Date.now()}`, total: cents(0), items: [] }
}
