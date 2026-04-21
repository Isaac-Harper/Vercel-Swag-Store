import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'

type CardProps = {
	slug: string
	name: string
	price: number
	color: string
	image?: string
}

export function Card({ slug, name, price, color, image }: CardProps) {
	return (
		<li>
			<Link href={`/products/${slug}`} className="flex flex-col gap-3 group">
				<div className="relative w-full pb-[100%]">
					{image ? (
						<Image
							src={image}
							alt={name}
							fill
							className="rounded object-cover"
						/>
					) : (
						<div
							style={{ backgroundColor: color }}
							className="absolute inset-0 rounded"
						/>
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
