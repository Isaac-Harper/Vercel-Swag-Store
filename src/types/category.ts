/**
 * Product category as returned by the catalog API. `productCount` is the
 * number of products currently assigned to the category.
 */
export type Category = {
	slug: string
	name: string
	productCount: number
}
