import { Pagination } from '@/components/search/Pagination'
import { PAGE_SIZE } from '@/components/search/SearchResultsList'
import { listProductsPaginated } from '@/lib/api/products'

/**
 * Renders the page selector for the search results. Lives in its own
 * non-keyed Suspense so the previous page's pagination stays visible (and
 * interactive) while a new page's products are loading — `'use cache'` on
 * `listProductsPaginated` dedupes the underlying fetch with `<SearchResultsList>`.
 */
export async function SearchPagination({
	params,
}: {
	params: { q?: string; category?: string; page?: string }
}) {
	const { q = '', category = '', page: pageRaw = '1' } = params
	const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)

	const { pagination } = await listProductsPaginated({
		q: q.trim() || undefined,
		category: category || undefined,
		limit: PAGE_SIZE,
		page,
	})

	const baseParams: Record<string, string> = {}
	if (q) baseParams.q = q
	if (category) baseParams.category = category

	return (
		<Pagination pathname="/search" baseParams={baseParams} totalPages={pagination.totalPages} />
	)
}
