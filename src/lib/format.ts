const priceFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
})

/** Formats a price given in the smallest currency unit (cents for USD). */
export function formatPrice(amountInCents: number): string {
	return priceFormatter.format(amountInCents / 100)
}
