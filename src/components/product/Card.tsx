import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'

type CardProps = {
	slug: string
	name: string
	price: number
	images: string[]
	/**
	 * `true` for above-the-fold cards — sets `priority` on the image so the
	 * browser starts the fetch before JS runs. Use sparingly.
	 */
	priority?: boolean
	/**
	 * Real-time stock level. `undefined` means stock wasn't fetched (treat as
	 * unknown — render normally). `0` greys the card and shows an "Out of
	 * stock" badge. 1–5 shows a "Only N left" badge.
	 */
	stock?: number
}

export function Card({ slug, name, price, images, priority, stock }: CardProps) {
	const image = images[0] ?? '/product-placeholder.svg'
	const outOfStock = stock === 0
	const lowStock = stock !== undefined && stock > 0 && stock <= 5
	return (
		<li>
			<Link
				href={`/products/${slug}`}
				className={`flex flex-col gap-3 group ${outOfStock ? 'opacity-60' : ''}`}
			>
				<div className="relative w-full pb-[100%]">
					<Image
						src={image}
						alt={name}
						fill
						priority={priority}
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
				<div className="flex items-center justify-between">
					<h3 className="font-medium group-hover:underline">{name}</h3>
					<p className="text-sm">{formatPrice(price)}</p>
				</div>
			</Link>
		</li>
	)
}
