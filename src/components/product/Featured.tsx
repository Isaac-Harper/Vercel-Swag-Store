import Link from 'next/link'
import { Card } from '@/components/product/Card'
import { ProductStockProvider } from '@/components/product/ProductStockProvider'
import { EagerPrefetch } from '@/components/ui/EagerPrefetch'
import { getListingStockMap, listProducts } from '@/lib/api/products'

const PRIORITY_COUNT = 2

export async function Featured() {
	const products = await listProducts({ featured: true })
	// Unawaited — feeds `<ProductStockProvider>` which paints cards on the
	// products fetch and streams stock badges in under its own Suspense.
	const stockPromise = getListingStockMap(products.map((p) => p.id))
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
				<ProductStockProvider stockPromise={stockPromise}>
					<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
						{products.map((product, i) => (
							<Card key={product.slug} {...product} priority={i < PRIORITY_COUNT} />
						))}
					</ul>
				</ProductStockProvider>
				<EagerPrefetch hrefs={products.map((p) => `/products/${p.slug}`)} />
			</div>
		</section>
	)
}
