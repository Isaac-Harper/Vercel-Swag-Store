export type Product = {
	name: string
	price: number
	color: string
	href: string
	image?: string
}

export const products: Product[] = [
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
