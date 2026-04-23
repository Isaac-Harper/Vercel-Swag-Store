/**
 * Real-time inventory snapshot for a product. `stock` is the current quantity
 * available; `lowStock` is true when 1–5 remain. Mirrors the `/products/{id}/stock`
 * response shape.
 */
export type StockInfo = {
	productId: string
	stock: number
	inStock: boolean
	lowStock: boolean
}
