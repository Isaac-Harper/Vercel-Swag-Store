import type { Cents } from '@/types/money'

const priceFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
})

export function formatPrice(amount: Cents): string {
	return priceFormatter.format(amount / 100)
}
