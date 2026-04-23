/**
 * Product as returned by the catalog API. Defined separately from any module
 * so consumers depend on the shape, not on a specific producer.
 *
 * `price` is in the smallest currency unit (cents for USD). Format with
 * `formatPrice` for display.
 */
export type Product = {
	id: string
	slug: string
	name: string
	description: string
	price: number
	currency: string
	category: string
	images: string[]
	tags: string[]
	featured: boolean
	createdAt: string
}
