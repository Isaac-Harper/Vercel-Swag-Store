import { Suspense } from 'react'
import { PaginationSkeleton } from '@/components/search/PaginationSkeleton'
import { SearchPagination } from '@/components/search/SearchPagination'
import { SearchResultsList } from '@/components/search/SearchResultsList'
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeleton'

/**
 * Awaits searchParams (must be inside Suspense per Cache Components) and
 * renders two independent Suspense boundaries:
 *
 * - The product grid is **keyed** so navigating to a different
 *   search/page/category re-shows the skeleton instead of holding stale results.
 * - The pagination is **not keyed** so the previous page's selector stays
 *   visible (and clickable) while the next page's products are streaming in.
 */
export async function SearchResults({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
	const params = await searchParams
	const key = `${params.q ?? ''}|${params.category ?? ''}|${params.page ?? '1'}`

	return (
		<>
			<Suspense key={key} fallback={<SearchResultsSkeleton />}>
				<SearchResultsList params={params} />
			</Suspense>
			<Suspense fallback={<PaginationSkeleton />}>
				<SearchPagination params={params} />
			</Suspense>
		</>
	)
}
