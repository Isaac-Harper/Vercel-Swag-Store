import { cacheLife } from 'next/cache'
import { z } from 'zod'
import { apiFetch } from '@/lib/api/client'
import type { StoreConfigResponse } from '@/types/api'
import type { StoreConfig } from '@/types/store'

const apiStoreConfigSchema = z.object({
	storeName: z.string(),
	currency: z.string(),
	features: z.object({
		wishlist: z.boolean(),
		productComparison: z.boolean(),
		reviews: z.boolean(),
		liveChat: z.boolean(),
		recentlyViewed: z.boolean(),
	}),
	socialLinks: z
		.object({
			twitter: z.string().optional(),
			github: z.string().optional(),
			discord: z.string().optional(),
		})
		.catchall(z.string()),
	seo: z.object({
		defaultTitle: z.string(),
		titleTemplate: z.string(),
		defaultDescription: z.string(),
	}),
}) satisfies z.ZodType<StoreConfig>

const apiStoreConfigResponseSchema = z.object({
	success: z.boolean(),
	data: apiStoreConfigSchema,
}) satisfies z.ZodType<StoreConfigResponse>

/**
 * Store-level config (name, currency, SEO defaults, social links, feature flags).
 * Cached aggressively — only changes on backend deploys, so 'hours' lifetime.
 * Bust the cache by redeploying the frontend or via a cacheTag if you wire one in.
 */
export async function getStoreConfig(): Promise<StoreConfig> {
	'use cache'

	cacheLife('hours')

	const raw = await apiFetch<unknown>('/store/config')
	const parsed = apiStoreConfigResponseSchema.parse(raw)
	return parsed.data
}
