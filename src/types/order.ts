import type { CartItem } from '@/types/cart'
import type { Cents } from '@/types/money'

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

/**
 * Opaque payment token produced by the processor's client SDK (Stripe Elements,
 * Adyen Web SDK, etc.). The raw PAN, CVC, and expiry are tokenized inside the
 * SDK's isolated iframe and never cross our server boundary — the server only
 * sees `token` (to charge) plus `last4` / `brand` (to render on the receipt).
 *
 * Keeping this surface PCI-light is what allows the order endpoint to live in
 * normal Next.js infrastructure without dragging the deployment into PCI scope.
 */
export type PaymentToken = {
	token: string
	cardholderName: string
	last4: string
	brand: string
}

/** Body sent to the (future) `POST /orders` endpoint. */
export type CreateOrderInput = {
	email: string
	shipping: ShippingAddress
	payment: PaymentToken
}

/** Discriminated result of an order placement attempt. */
export type OrderResult =
	| {
			status: 'paid'
			orderId: string
			total: Cents
			items: CartItem[]
	  }
	| {
			status: 'declined'
			reason: string
	  }
