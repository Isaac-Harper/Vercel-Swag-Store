import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AddToCartForm } from '@/components/AddToCartForm'
import { JsonLd } from '@/components/JsonLd'
import { getProductBySlug, products } from '@/data/products'
import { formatPrice } from '@/lib/format'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export function generateStaticParams() {
	return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const product = getProductBySlug(slug)
	if (!product) return {}
	const url = `/products/${product.slug}`
	return {
		title: product.name,
		description: product.description,
		alternates: { canonical: url },
		openGraph: {
			title: product.name,
			description: product.description,
			url,
			type: 'website',
		},
	}
}

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const product = getProductBySlug(slug)
	if (!product) notFound()

	const productUrl = `${SITE_URL}/products/${product.slug}`
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: product.name,
		description: product.description,
		sku: product.slug,
		category: product.category,
		image: `${productUrl}/opengraph-image`,
		offers: {
			'@type': 'Offer',
			url: productUrl,
			priceCurrency: 'USD',
			price: product.price,
			availability:
				product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
		},
	}

	const stockMessage =
		product.stock === 0
			? 'Out of stock'
			: product.stock <= 10
				? `Only ${product.stock} left in stock`
				: 'In stock'

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="px-4 py-16">
				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
					<div className="relative w-full pb-[100%]">
						<div
							style={{ backgroundColor: product.color }}
							className="absolute inset-0 rounded"
						/>
					</div>
					<div className="flex flex-col gap-4">
						<p className="text-xs uppercase tracking-wide text-gray-500">
							{product.category}
						</p>
						<h1 className="text-3xl font-bold">{product.name}</h1>
						<p className="text-2xl">{formatPrice(product.price)}</p>
						<p
							className={`text-sm ${product.stock === 0 ? 'text-red-600' : 'text-gray-600'}`}
						>
							{stockMessage}
						</p>
						<p className="text-base text-gray-700">{product.description}</p>
						<AddToCartForm slug={product.slug} stock={product.stock} />
					</div>
				</div>
			</section>
		</>
	)
}
