import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { JsonLd } from '@/components/ui/JsonLd'
import { ProductStockAndCart } from '@/components/product/ProductStockAndCart'
import { ProductStockAndCartSkeleton } from '@/components/product/ProductStockAndCartSkeleton'
import { getProduct, listProducts } from '@/lib/api/products'
import { formatPrice } from '@/lib/format'
import {
	PRODUCT_PLACEHOLDER_BLUR,
	PRODUCT_PLACEHOLDER_SRC,
} from '@/lib/image-placeholder'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export async function generateStaticParams() {
	const products = await listProducts()
	return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const product = await getProduct(slug)
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
	const product = await getProduct(slug)
	if (!product) notFound()

	const productUrl = `${SITE_URL}/products/${product.slug}`
	const image = product.images[0] ?? PRODUCT_PLACEHOLDER_SRC
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
			priceCurrency: product.currency,
			price: product.price / 100,
			availability: 'https://schema.org/InStock',
		},
	}

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="px-4 py-16">
				<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
					<div className="relative w-full pb-[100%]">
						<Image
							src={image}
							alt={product.name}
							fill
							sizes="(min-width: 768px) 50vw, 100vw"
							priority
							placeholder="blur"
							blurDataURL={PRODUCT_PLACEHOLDER_BLUR}
							className="rounded object-cover"
						/>
					</div>
					<div className="flex flex-col gap-4">
						<p className="text-xs uppercase tracking-wide text-gray-500">
							{product.category}
						</p>
						<h1 className="text-3xl font-bold">{product.name}</h1>
						<p className="text-2xl">{formatPrice(product.price)}</p>
						<p className="text-base text-gray-700">{product.description}</p>
						<Suspense fallback={<ProductStockAndCartSkeleton />}>
							<ProductStockAndCart slug={product.slug} />
						</Suspense>
					</div>
				</div>
			</section>
		</>
	)
}
