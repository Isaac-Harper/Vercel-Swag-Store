import { Card } from '@/components/product/Card'
import { Pagination } from '@/components/search/Pagination'
import { EagerPrefetch } from '@/components/ui/EagerPrefetch'
import { getProductStockForListing, listProductsPaginated } from '@/lib/api/products'

const PAGE_SIZE = 5

export async function SearchResults({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
	const { q = '', category = '', page: pageRaw = '1' } = await searchParams
	const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1)

	const { data: results, pagination } = await listProductsPaginated({
		q: q.trim() || undefined,
		category: category || undefined,
		limit: PAGE_SIZE,
		page,
	})

	if (results.length === 0) {
		return (
			<p className="text-gray-600">
				No products match {q ? `"${q}"` : 'your filters'}.
			</p>
		)
	}

	// Resolve stock before rendering to avoid badges popping in after first paint.
	const stocks = await Promise.all(results.map((p) => getProductStockForListing(p.id)))

	const start = (page - 1) * PAGE_SIZE + 1
	const end = start + results.length - 1

	const baseParams: Record<string, string> = {}
	if (q) baseParams.q = q
	if (category) baseParams.category = category

	return (
		<>
			<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
				{results.map((product, i) => (
					<Card key={product.slug} {...product} stock={stocks[i]?.stock} />
				))}
			</ul>
			<EagerPrefetch hrefs={results.map((p) => `/products/${p.slug}`)} />
			<p className="mt-4 text-xs text-gray-500">
				Showing {start}–{end} of {pagination.total} results.
			</p>
			<Pagination
				pathname="/search"
				baseParams={baseParams}
				currentPage={pagination.page}
				totalPages={pagination.totalPages}
			/>
		</>
	)
}
