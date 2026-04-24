import 'server-only'

import { cacheLife } from 'next/cache'
import { z } from 'zod'
import { apiFetch } from '@/lib/api/client'
import type { PromotionResponse } from '@/types/api'
import type { Promotion } from '@/types/promotion'

const apiPromoSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string(),
	discountPercent: z.number(),
	code: z.string(),
	validFrom: z.string(),
	validUntil: z.string(),
	active: z.boolean(),
}) satisfies z.ZodType<Promotion>

// The "no active promo" case surfaces as either a non-2xx or a parse failure
// here; the caller's catch block converts both into `null`.
const apiPromoResponseSchema = z.object({
	success: z.boolean(),
	data: apiPromoSchema,
}) satisfies z.ZodType<PromotionResponse>

/**
 * Returns the currently active promotion (or null when none is active).
 * Cached briefly so banner flips quickly when an admin changes it.
 */
export async function getActivePromo(): Promise<Promotion | null> {
	'use cache'

	cacheLife('minutes')

	try {
		const raw = await apiFetch<unknown>('/promotions')
		const parsed = apiPromoResponseSchema.parse(raw)
		return parsed.data
	} catch {
		return null
	}
}
