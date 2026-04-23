import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { formatPrice } from '@/lib/format'

type CardProps = {
	slug: string
	name: string
	price: number
	images: string[]
	/**
	 * `true` for above-the-fold cards — sets `priority` + `fetchPriority="high"`
	 * on the image so the browser starts the fetch before JS runs. Use sparingly.
	 */
	priority?: boolean
	/** Slot for an absolutely-positioned overlay (stock badge / out-of-stock veil). */
	stockBadge?: ReactNode
}

export function Card({ slug, name, price, images, priority, stockBadge }: CardProps) {
	const image = images[0] ?? '/product-placeholder.svg'
	return (
		<li>
			<Link href={`/products/${slug}`} className="flex flex-col gap-3 group">
				<div className="relative w-full pb-[100%]">
					<Image
						src={image}
						alt={name}
						fill
						priority={priority}
						sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
						className="rounded object-cover"
					/>
					{stockBadge}
				</div>
				<div className="flex items-center justify-between">
					<h3 className="font-medium group-hover:underline">{name}</h3>
					<p className="text-sm">{formatPrice(price)}</p>
				</div>
			</Link>
		</li>
	)
}
