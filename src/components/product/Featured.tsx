import Link from 'next/link'
import { Card } from '@/components/product/Card'
import { listProducts } from '@/lib/api/products'

const PRIORITY_COUNT = 2
const MIN_COUNT = 6

export async function Featured() {
	const featured = await listProducts({ featured: true, limit: MIN_COUNT })
	// Spec requires at least 6 — backfill with non-featured products if
	// the backend returns fewer featured entries than we need.
	let products = featured
	if (featured.length < MIN_COUNT) {
		const fill = await listProducts({ limit: MIN_COUNT })
		const seen = new Set(featured.map((p) => p.id))
		products = [...featured, ...fill.filter((p) => !seen.has(p.id))].slice(0, MIN_COUNT)
	}
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
						<Card key={product.slug} {...product} priority={i < PRIORITY_COUNT} />
					))}
				</ul>
			</div>
		</section>
	)
}
