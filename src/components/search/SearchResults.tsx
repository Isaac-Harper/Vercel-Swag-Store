import { Suspense } from 'react'
import { Card } from '@/components/product/Card'
import { EagerPrefetch } from '@/components/ui/EagerPrefetch'
import { StockBadge } from '@/components/product/StockBadge'
import { listProducts } from '@/lib/api/products'

const MAX_RESULTS = 5

export async function SearchResults({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string }>
}) {
	const { q = '', category = '' } = await searchParams

	const filtered = await listProducts({
		q: q.trim() || undefined,
		category: category || undefined,
	})
	const results = filtered.slice(0, MAX_RESULTS)

	if (results.length === 0) {
		return (
			<p className="text-gray-600">
				No products match {q ? `"${q}"` : 'your filters'}.
			</p>
		)
	}

	return (
		<>
			<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
				{results.map((product) => (
					<Card
						key={product.slug}
						{...product}
						stockBadge={
							<Suspense fallback={null}>
								<StockBadge productId={product.id} />
							</Suspense>
						}
					/>
				))}
			</ul>
			<EagerPrefetch hrefs={results.map((p) => `/products/${p.slug}`)} />
			{filtered.length > MAX_RESULTS && (
				<p className="mt-4 text-xs text-gray-500">
					Showing {MAX_RESULTS} of {filtered.length} results.
				</p>
			)}
		</>
	)
}
