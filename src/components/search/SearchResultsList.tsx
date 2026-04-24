import Link from 'next/link'
import { Card } from '@/components/product/Card'
import { ProductStockProvider } from '@/components/product/ProductStockProvider'
import { EagerPrefetch } from '@/components/ui/EagerPrefetch'
import { getListingStockMap, listProductsPaginated } from '@/lib/api/products'

export const PAGE_SIZE = 5

/**
 * Inner data-fetcher for `<SearchResults>`. Receives resolved params so the
 * keyed Suspense in the parent can re-suspend cleanly when the user paginates
 * or changes the search query. The page selector itself lives in
 * `<SearchPagination>` (sibling, non-keyed Suspense) so it stays visible
 * while a new page's products are streaming.
 */
export async function SearchResultsList({
	params,
}: {
	params: { q?: string; category?: string; page?: string }
}) {
	const { q = '', category = '', page: pageRaw = '1' } = params
	const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)

	const { data: results, pagination } = await listProductsPaginated({
		q: q.trim() || undefined,
		category: category || undefined,
		limit: PAGE_SIZE,
		page,
	})

	if (results.length === 0) {
		if (pagination.total > 0 && page > pagination.totalPages) {
			const searchParams = new URLSearchParams()
			if (q) searchParams.set('q', q)
			if (category) searchParams.set('category', category)
			const qs = searchParams.toString()
			const firstPageHref = qs ? `/search?${qs}` : '/search'
			return (
				<p className="text-gray-600">
					Page {page} of {pagination.totalPages} doesn&rsquo;t exist.{' '}
					<Link href={firstPageHref} className="underline">
						Back to page 1
					</Link>
					.
				</p>
			)
		}
		return (
			<p className="text-gray-600">
				No products match {q ? `"${q}"` : 'your filters'}.
			</p>
		)
	}

	// Unawaited — the card grid paints on the products fetch; badges stream
	// in via `<ProductStockProvider>` once the stock map resolves.
	const stockPromise = getListingStockMap(results.map((p) => p.id))

	const start = (page - 1) * PAGE_SIZE + 1
	const end = start + results.length - 1

	return (
		<>
			<ProductStockProvider stockPromise={stockPromise}>
				<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
					{results.map((product) => (
						<Card key={product.slug} {...product} />
					))}
				</ul>
			</ProductStockProvider>
			<EagerPrefetch hrefs={results.map((p) => `/products/${p.slug}`)} />
			<p className="mt-4 text-xs text-gray-500">
				Showing {start}–{end} of {pagination.total} results.
			</p>
		</>
	)
}
