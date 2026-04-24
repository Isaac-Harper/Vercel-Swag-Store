import 'server-only'

import { cacheLife } from 'next/cache'
import { z } from 'zod'
import { apiFetch } from '@/lib/api/client'
import type { CategoryListResponse } from '@/types/api'
import type { Category } from '@/types/category'

const apiCategorySchema = z.object({
	slug: z.string(),
	name: z.string(),
	productCount: z.number(),
}) satisfies z.ZodType<Category>

const apiCategoriesResponseSchema = z.object({
	success: z.boolean(),
	data: z.array(apiCategorySchema),
}) satisfies z.ZodType<CategoryListResponse>

export async function listCategories(): Promise<Category[]> {
	'use cache'

	cacheLife('hours')
	const raw = await apiFetch<unknown>('/categories')
	const parsed = apiCategoriesResponseSchema.parse(raw)
	return parsed.data
}
