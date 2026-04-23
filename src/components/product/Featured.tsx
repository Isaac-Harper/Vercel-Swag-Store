import Link from 'next/link'
import { Suspense } from 'react'
import { Card } from '@/components/product/Card'
import { EagerPrefetch } from '@/components/ui/EagerPrefetch'
import { StockBadge } from '@/components/product/StockBadge'
import { listProducts } from '@/lib/api/products'

const PRIORITY_COUNT = 2

export async function Featured() {
	const products = await listProducts({ featured: true })
	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 flex items-baseline justify-between gap-4">
					<h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
					<Link
						href="/search"
						className="text-sm font-medium underline underline-offset-4 hover:no-underline whitespace-nowrap"
					>
						View all
					</Link>
				</div>
				<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
					{products.map((product, i) => (
						<Card
							key={product.slug}
							{...product}
							priority={i < PRIORITY_COUNT}
							stockBadge={
								<Suspense fallback={null}>
									<StockBadge productId={product.id} />
								</Suspense>
							}
						/>
					))}
				</ul>
				<EagerPrefetch hrefs={products.map((p) => `/products/${p.slug}`)} />
			</div>
		</section>
	)
}
