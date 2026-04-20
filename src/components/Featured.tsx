import { Card } from '@/components/Card'

const products = [
	{
		name: 'Vercel Tee',
		price: 29,
		color: '#000000',
	},
	{
		name: 'Next.js Hoodie',
		price: 69,
		color: '#111827',
	},
	{
		name: 'Triangle Cap',
		price: 24,
		color: '#1f2937',
	},
	{
		name: 'Edge Mug',
		price: 18,
		color: '#374151',
	},
]

export function Featured() {
	return (
		<section className="px-4 py-16 bg-white text-black">
			<div className="mx-auto max-w-6xl">
				<h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
				<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
					{products.map((product) => (
						<Card key={product.name} {...product} />
					))}
				</ul>
			</div>
		</section>
	)
}
