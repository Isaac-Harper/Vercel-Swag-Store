import type { CartWithProducts } from '@/types/cart'
import type { Category } from '@/types/category'
import type { PaginationMeta } from '@/types/pagination'
import type { Product } from '@/types/product'
import type { Promotion } from '@/types/promotion'
import type { StockInfo } from '@/types/stock'
import type { StoreConfig } from '@/types/store'

/**
 * Envelope returned by `GET /products`. `success` is the API-wide call status,
 * `data` is the page of products, `meta.pagination` describes the slice.
 */
export type ProductListResponse = {
	success: boolean
	data: Product[]
	meta: {
		pagination: PaginationMeta
	}
}

/** Envelope returned by `GET /products/{slug}`. */
export type ProductResponse = {
	success: boolean
	data: Product
}

/** Envelope returned by `GET /products/{slugOrId}/stock`. */
export type StockResponse = {
	success: boolean
	data: StockInfo
}

/** Envelope returned by `GET /categories`. */
export type CategoryListResponse = {
	success: boolean
	data: Category[]
}

/** Envelope returned by `GET /promotions`. */
export type PromotionResponse = {
	success: boolean
	data: Promotion
}

/** Envelope returned by `GET /cart` and the cart mutation endpoints. */
export type CartResponse = {
	success: boolean
	data: CartWithProducts
}

/** Envelope returned by `GET /store/config`. */
export type StoreConfigResponse = {
	success: boolean
	data: StoreConfig
}

/** Body for `POST /cart`. `quantity` defaults to 1 server-side; min 1. */
export type AddToCartRequest = {
	productId: string
	quantity?: number
}

/** Body for `PATCH /cart/{productId}`. Set `quantity` to 0 to remove the line. */
export type UpdateCartItemRequest = {
	quantity: number
}

/**
 * Error envelope returned for any non-2xx response. `code` is a stable
 * machine-readable identifier; `message` is human-readable; `details` is
 * shape-agnostic extra context (validation errors, etc.).
 */
export type ErrorResponse = {
	success: boolean
	error: {
		code: string
		message: string
		details?: unknown
	}
}
