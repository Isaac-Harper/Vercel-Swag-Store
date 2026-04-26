import type { Cents } from '@/types/money'

/**
 * Product as returned by the catalog API. Defined separately from any module
 * so consumers depend on the shape, not on a specific producer.
 */
export type Product = {
	id: string
	slug: string
	name: string
	description: string
	price: Cents
	currency: string
	category: string
	images: string[]
	tags: string[]
	featured: boolean
	createdAt: string
}
