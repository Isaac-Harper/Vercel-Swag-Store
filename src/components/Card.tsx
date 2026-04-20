import Image from 'next/image'

type CardProps = {
	name: string
	price: number
	color: string
	image?: string
}

export function Card({ name, price, color, image }: CardProps) {
	return (
		<li className="flex flex-col gap-3">
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
				<h3 className="font-medium">{name}</h3>
				<p className="text-sm">${price}</p>
			</div>
		</li>
	)
}
