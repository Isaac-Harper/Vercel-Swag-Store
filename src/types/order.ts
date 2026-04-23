import type { CartItem } from '@/types/cart'

/** Shipping address collected at checkout. Field names mirror the WHATWG
 * autocomplete tokens (`given-name`, `address-line1`, etc.) but in camelCase. */
export type ShippingAddress = {
	givenName: string
	familyName: string
	addressLine1: string
	addressLine2?: string
	city: string
	state: string
	postalCode: string
	country: string
	phone?: string
}

/** Card payment details captured at checkout. Never persisted client-side. */
export type PaymentDetails = {
	cardNumber: string
	cardholderName: string
	expiry: string
	cvc: string
}

/** Body sent to the (future) `POST /orders` endpoint. */
export type CreateOrderInput = {
	email: string
	shipping: ShippingAddress
	payment: PaymentDetails
}

/** Discriminated result of an order placement attempt. */
export type OrderResult =
	| {
			status: 'paid'
			orderId: string
			total: number
			items: CartItem[]
	  }
	| {
			status: 'declined'
			reason: string
	  }
