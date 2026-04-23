import { Suspense } from 'react'
import { SearchResultsList } from '@/components/search/SearchResultsList'
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeleton'

/**
 * Awaits searchParams (must be inside Suspense per Cache Components) and wraps
 * the actual list in a keyed Suspense so navigating to a different
 * search/page/category re-shows the skeleton instead of holding stale results
 * until the new ones resolve.
 */
export async function SearchResults({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
	const params = await searchParams
	const key = `${params.q ?? ''}|${params.category ?? ''}|${params.page ?? '1'}`

	return (
		<Suspense key={key} fallback={<SearchResultsSkeleton />}>
			<SearchResultsList params={params} />
		</Suspense>
	)
}
