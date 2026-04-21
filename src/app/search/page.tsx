import type { Metadata } from 'next'
import { Card } from '@/components/Card'
import { products } from '@/data/products'

export const metadata: Metadata = {
	title: 'Search',
	description: 'Browse all Vercel swag products.',
	alternates: { canonical: '/search' },
	openGraph: {
		title: 'Search',
		description: 'Browse all Vercel swag products.',
		url: '/search',
	},
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>
}) {
	const { q = '' } = await searchParams
	const query = q.trim().toLowerCase()
	const results = query ? products.filter((p) => p.name.toLowerCase().includes(query)) : products

	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<h1 className="mb-8 text-2xl sm:text-3xl font-bold">Search</h1>
				<form className="mb-8">
					<input
						type="search"
						name="q"
						defaultValue={q}
						placeholder="Search products..."
						className="w-full rounded border border-gray-300 px-4 py-2"
					/>
				</form>
				{results.length === 0 ? (
					<p>No products match &ldquo;{q}&rdquo;.</p>
				) : (
					<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
						{results.map((product) => (
							<Card key={product.slug} {...product} />
						))}
					</ul>
				)}
			</div>
		</section>
	)
}
