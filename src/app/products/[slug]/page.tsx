import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AddToCartForm } from '@/components/AddToCartForm'
import { JsonLd } from '@/components/JsonLd'
import { getProductBySlug } from '@/data/products'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const product = getProductBySlug(slug)
	if (!product) return {}
	const description = `${product.name} — $${product.price}. Premium Vercel swag.`
	const url = `/products/${product.slug}`
	return {
		title: product.name,
		description,
		alternates: { canonical: url },
		openGraph: {
			title: product.name,
			description,
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
		description: `${product.name} — Premium Vercel swag.`,
		sku: product.slug,
		image: `${productUrl}/opengraph-image`,
		offers: {
			'@type': 'Offer',
			url: productUrl,
			priceCurrency: 'USD',
			price: product.price,
			availability: 'https://schema.org/InStock',
		},
	}

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
						<h1 className="text-3xl font-bold">{product.name}</h1>
						<p className="text-2xl">${product.price}</p>
						<AddToCartForm slug={product.slug} />
					</div>
				</div>
			</section>
		</>
	)
}
