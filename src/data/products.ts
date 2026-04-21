export type Product = {
	slug: string
	name: string
	price: number
	color: string
	image?: string
}

export const products: Product[] = [
	{
		slug: 'vercel-tee',
		name: 'Vercel Tee',
		price: 29,
		color: '#000000',
	},
	{
		slug: 'nextjs-hoodie',
		name: 'Next.js Hoodie',
		price: 69,
		color: '#111827',
	},
	{
		slug: 'triangle-cap',
		name: 'Triangle Cap',
		price: 24,
		color: '#1f2937',
	},
	{
		slug: 'edge-mug',
		name: 'Edge Mug',
		price: 18,
		color: '#374151',
	},
]

export function getProductBySlug(slug: string) {
	return products.find((p) => p.slug === slug)
}
