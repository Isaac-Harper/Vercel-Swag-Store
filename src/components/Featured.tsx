import Link from 'next/link'
import { Card } from '@/components/Card'

const products = [
	{
		name: 'Vercel Tee',
		price: 29,
		color: '#000000',
		href: '/products/vercel-tee',
	},
	{
		name: 'Next.js Hoodie',
		price: 69,
		color: '#111827',
		href: '/products/nextjs-hoodie',
	},
	{
		name: 'Triangle Cap',
		price: 24,
		color: '#1f2937',
		href: '/products/triangle-cap',
	},
	{
		name: 'Edge Mug',
		price: 18,
		color: '#374151',
		href: '/products/edge-mug',
	},
]

export function Featured() {
	return (
		<section className="px-4 py-16 bg-white text-black">
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
					{products.map((product) => (
						<Card key={product.name} {...product} />
					))}
				</ul>
			</div>
		</section>
	)
}
