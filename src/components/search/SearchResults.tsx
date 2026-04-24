import { Suspense } from 'react'
import { PaginationSkeleton } from '@/components/search/PaginationSkeleton'
import { PendingGate } from '@/components/search/PendingGate'
import { SearchPagination } from '@/components/search/SearchPagination'
import { SearchResultsList } from '@/components/search/SearchResultsList'
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeleton'

/**
 * Awaits searchParams (must be inside Suspense per Cache Components) and
 * renders two independent Suspense boundaries. The enclosing
 * `<SearchNavProvider>` in `src/app/search/page.tsx` provides the pending
 * state consumed below:
 *
 * - The product grid sits behind `<PendingGate>` so the skeleton appears
 *   instantly on any nav that flips `isPending` — pagination clicks AND
 *   query / category edits from `<SearchForm>`. Without the gate the keyed
 *   Suspense below never gets to flash its fallback when the server cache
 *   for `listProductsPaginated` is warm.
 * - The pagination stays mounted outside the gate so the selector remains
 *   visible (and clickable) while a new page's products are loading.
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
			<PendingGate fallback={<SearchResultsSkeleton />}>
				<Suspense key={key} fallback={<SearchResultsSkeleton />}>
					<SearchResultsList params={params} />
				</Suspense>
			</PendingGate>
			<Suspense fallback={<PaginationSkeleton />}>
				<SearchPagination params={params} />
			</Suspense>
		</>
	)
}
