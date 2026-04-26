import 'server-only'

import { cacheLife } from 'next/cache'
import { z } from 'zod'
import { apiFetch } from '@/lib/api/client'
import type { ProductListResponse, ProductResponse, StockResponse } from '@/types/api'
import { type Cents, cents } from '@/types/money'
import type { PaginationMeta } from '@/types/pagination'
import type { Product } from '@/types/product'
import type { StockInfo } from '@/types/stock'

/** Brands a raw API number as `Cents` at the parse boundary. */
export const centsSchema = z.number().transform((n): Cents => cents(n))

/** Runtime validator that mirrors the `Product` type. Kept in sync by the
 * `satisfies` clause below — adding a field to `Product` without updating the
 * schema (or vice versa) is a type error. */
export const apiProductSchema = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	description: z.string(),
	price: centsSchema,
	currency: z.string(),
	category: z.string(),
	images: z.array(z.string()),
	tags: z.array(z.string()),
	featured: z.boolean(),
	createdAt: z.string(),
}) satisfies z.ZodType<Product>

const apiPaginationSchema = z.object({
	page: z.number(),
	limit: z.number(),
	total: z.number(),
	totalPages: z.number(),
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
}) satisfies z.ZodType<PaginationMeta>

const apiListResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(apiProductSchema),
	meta: z.object({ pagination: apiPaginationSchema }),
}) satisfies z.ZodType<ProductListResponse>

const apiSingleResponseSchema = z.object({
	success: z.boolean(),
	data: apiProductSchema,
}) satisfies z.ZodType<ProductResponse>

const apiStockSchema = z.object({
	productId: z.string(),
	stock: z.number(),
	inStock: z.boolean(),
	lowStock: z.boolean(),
}) satisfies z.ZodType<StockInfo>

const apiStockResponseSchema = z.object({
	success: z.boolean(),
	data: apiStockSchema,
}) satisfies z.ZodType<StockResponse>

export type ListProductsOptions = {
	category?: string
	q?: string
	limit?: number
	page?: number
	featured?: boolean
}

export async function listProductsPaginated(
	opts: ListProductsOptions = {},
): Promise<{ data: Product[]; pagination: PaginationMeta }> {
	'use cache'

	cacheLife('hours')

	const raw = await apiFetch<unknown>('/products', {
		params: {
			page: opts.page,
			limit: opts.limit,
			category: opts.category,
			search: opts.q,
			featured: opts.featured,
		},
	})
	const parsed = apiListResponseSchema.parse(raw)
	return { data: parsed.data, pagination: parsed.meta.pagination }
}

export async function listProducts(opts: ListProductsOptions = {}): Promise<Product[]> {
	return (await listProductsPaginated(opts)).data
}

export async function getProduct(slug: string): Promise<Product | null> {
	'use cache'

	cacheLife('hours')

	try {
		const raw = await apiFetch<unknown>(`/products/${encodeURIComponent(slug)}`)
		return apiSingleResponseSchema.parse(raw).data
	} catch (err) {
		if (err instanceof Error && err.message.includes('→ 404')) return null
		throw err
	}
}

/**
 * Real-time inventory lookup. Accepts product slug OR id.
 * Returns null if the product isn't found.
 * Not cached — stock can change at any moment; consumers should wrap in Suspense.
 */
export async function getProductStock(slugOrId: string): Promise<StockInfo | null> {
	try {
		const raw = await apiFetch<unknown>(`/products/${encodeURIComponent(slugOrId)}/stock`)
		return apiStockResponseSchema.parse(raw).data
	} catch (err) {
		if (err instanceof Error && err.message.includes('→ 404')) return null
		throw err
	}
}

/**
 * Hour-cached stock lookup used by every UI surface: featured, search,
 * detail page, and the cart drawer. One shared cache entry per productId
 * means all surfaces agree on the displayed value for the TTL window —
 * important because the `/stock` endpoint returns a random value per call,
 * so any shorter TTL produces jarring drift across pages.
 *
 * Checkout MUST use uncached `getProductStock` for an authoritative read
 * at charge time.
 */
export async function getProductStockCached(slugOrId: string): Promise<StockInfo | null> {
	'use cache'

	cacheLife('hours')
	return getProductStock(slugOrId)
}

/**
 * `productId -> stock` for a set of listed products. Pass the unawaited
 * promise to `<ProductStockProvider>` so the card grid paints on the product
 * list fetch and stock badges stream in behind their own Suspense. Missing
 * entries = stock unknown.
 */
export async function getListingStockMap(
	productIds: readonly string[],
): Promise<Map<string, number>> {
	if (productIds.length === 0) return new Map()
	const stocks = await Promise.all(productIds.map((id) => getProductStockCached(id)))
	const entries: [string, number][] = []
	productIds.forEach((id, i) => {
		const s = stocks[i]?.stock
		if (typeof s === 'number') entries.push([id, s])
	})
	return new Map(entries)
}
