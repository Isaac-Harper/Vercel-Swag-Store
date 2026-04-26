import { cacheLife } from 'next/cache'
import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import { getProduct, listProducts } from '@/lib/api/products'
import { formatPrice } from '@/lib/format'
import { SITE_URL } from '@/lib/site'

export const alt = 'Vercel Swag Store product'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PLACEHOLDER_IMAGE = `${SITE_URL}/product-placeholder.svg`

export async function generateStaticParams() {
	const products = await listProducts()
	return products.map((p) => ({ slug: p.slug }))
}

/**
 * Fetch the product image and inline it as a data URL. next/og's `<img>`
 * fetches its `src` after the request handler returns, which races the
 * prerender's completion and forces this route to render dynamically. By
 * resolving bytes inside the awaited chain we keep the route SSG-eligible.
 */
async function fetchAsDataUrl(url: string): Promise<string> {
	'use cache'

	// Source bytes at a given URL are immutable (the URL changes when the image
	// is replaced), so a long TTL is safe and saves OG-route regeneration.
	cacheLife('days')

	const res = await fetch(url)
	const mime = res.headers.get('content-type') ?? 'image/png'
	const buf = Buffer.from(await res.arrayBuffer())
	return `data:${mime};base64,${buf.toString('base64')}`
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const product = await getProduct(slug)
	if (!product) notFound()

	const image = await fetchAsDataUrl(product.images[0] ?? PLACEHOLDER_IMAGE)

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					width: '100%',
					height: '100%',
					backgroundColor: '#ffffff',
				}}
			>
				<div
					style={{
						width: '50%',
						height: '100%',
						display: 'flex',
					}}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={image}
						alt=""
						width={600}
						height={630}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				</div>
				<div
					style={{
						width: '50%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						padding: 80,
						gap: 24,
					}}
				>
					<div
						style={{
							fontSize: 32,
							color: '#666666',
							textTransform: 'uppercase',
							letterSpacing: 2,
						}}
					>
						Vercel Swag Store
					</div>
					<div style={{ fontSize: 72, fontWeight: 700, color: '#000000' }}>{product.name}</div>
					<div style={{ fontSize: 56, color: '#000000' }}>{formatPrice(product.price)}</div>
				</div>
			</div>
		),
		size
	)
}
