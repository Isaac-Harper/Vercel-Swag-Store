'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useProductStockMap } from '@/components/product/ProductStockProvider'
import { formatPrice } from '@/lib/format'
import type { Cents } from '@/types/money'
import {
	PRODUCT_PLACEHOLDER_BLUR,
	PRODUCT_PLACEHOLDER_SRC,
} from '@/lib/image-placeholder'

type CardProps = {
	id: string
	slug: string
	name: string
	price: Cents
	images: string[]
	/**
	 * `true` for above-the-fold cards — sets `priority` on the image so the
	 * browser starts the fetch before JS runs. Use sparingly.
	 */
	priority?: boolean
}

export function Card({ id, slug, name, price, images, priority }: CardProps) {
	const image = images[0] ?? PRODUCT_PLACEHOLDER_SRC
	// `undefined` = stock hasn't streamed in yet (or backend had no record).
	// Render the card normally; badges appear once `<ProductStockProvider>`
	// resolves its stock promise.
	const stock = useProductStockMap().get(id)
	const outOfStock = stock === 0
	const lowStock = stock !== undefined && stock > 0 && stock <= 5
	return (
		<li>
			<Link
				href={`/products/${slug}`}
				className={`relative flex flex-col gap-3 group ${outOfStock ? 'opacity-60' : ''}`}
			>
				<div className="relative w-full pb-[100%]">
					<Image
						src={image}
						alt={name}
						fill
						priority={priority}
						placeholder="blur"
						blurDataURL={PRODUCT_PLACEHOLDER_BLUR}
						sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
						className={`rounded object-cover ${outOfStock ? 'grayscale' : ''}`}
					/>
					{outOfStock && (
						<>
							<div className="absolute inset-0 rounded bg-white/50" aria-hidden />
							<span className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
								Out of stock
							</span>
						</>
					)}
					{lowStock && (
						<span className="absolute left-2 top-2 rounded bg-amber-700 px-2 py-1 text-xs font-medium text-white">
							Only {stock} left
						</span>
					)}
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
					<h3 className="font-medium group-hover:underline">{name}</h3>
					<p className="text-sm">{formatPrice(price)}</p>
				</div>
			</Link>
		</li>
	)
}
