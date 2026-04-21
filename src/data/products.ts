export type Category = 'Apparel' | 'Accessories' | 'Drinkware' | 'Stickers'

export const categories: Category[] = [
	'Apparel',
	'Accessories',
	'Drinkware',
	'Stickers',
]

export type Product = {
	slug: string
	name: string
	price: number
	color: string
	description: string
	stock: number
	category: Category
	image?: string
}

export const products: Product[] = [
	{
		slug: 'vercel-tee',
		name: 'Vercel Tee',
		price: 29,
		color: '#000000',
		description:
			'Soft 100% combed cotton tee with the Vercel triangle screen-printed on the chest. Cut for a relaxed fit.',
		stock: 25,
		category: 'Apparel',
	},
	{
		slug: 'nextjs-hoodie',
		name: 'Next.js Hoodie',
		price: 69,
		color: '#111827',
		description:
			'Heavyweight 12oz pullover hoodie in midnight black with an embroidered Next.js wordmark.',
		stock: 12,
		category: 'Apparel',
	},
	{
		slug: 'triangle-cap',
		name: 'Triangle Cap',
		price: 24,
		color: '#1f2937',
		description:
			'Six-panel structured cap with adjustable strap and an embroidered Vercel triangle on the front.',
		stock: 40,
		category: 'Accessories',
	},
	{
		slug: 'edge-mug',
		name: 'Edge Mug',
		price: 18,
		color: '#374151',
		description:
			'12oz ceramic mug. Microwave and dishwasher safe. Edge runtime not included.',
		stock: 0,
		category: 'Drinkware',
	},
	{
		slug: 'vercel-sticker-pack',
		name: 'Vercel Sticker Pack',
		price: 8,
		color: '#fbbf24',
		description:
			'A set of six matte vinyl stickers featuring the Vercel, Next.js, Geist, and Turbo wordmarks.',
		stock: 100,
		category: 'Stickers',
	},
	{
		slug: 'edge-notebook',
		name: 'Edge Notebook',
		price: 22,
		color: '#7c3aed',
		description:
			'A6 hardcover notebook with dotted pages and a built-in ribbon bookmark. Perfect for pre-deploy debugging.',
		stock: 30,
		category: 'Accessories',
	},
	{
		slug: 'geist-socks',
		name: 'Geist Socks',
		price: 14,
		color: '#dc2626',
		description:
			'Crew socks in monochrome with the Geist wordmark woven into the cuff. Combed cotton blend.',
		stock: 50,
		category: 'Apparel',
	},
	{
		slug: 'deploy-bottle',
		name: 'Deploy Bottle',
		price: 32,
		color: '#0891b2',
		description:
			'Stainless steel double-walled insulated bottle. Holds 24oz. Keeps cold for 24 hours.',
		stock: 18,
		category: 'Drinkware',
	},
]

export function getProductBySlug(slug: string) {
	return products.find((p) => p.slug === slug)
}
