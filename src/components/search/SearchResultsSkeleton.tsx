import Image from 'next/image'
import { PRODUCT_PLACEHOLDER_SRC } from '@/lib/image-placeholder'

export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
	const keys = Array.from({ length: count }, (_, i) => `search-skeleton-${i}`)
	return (
		<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
			{keys.map((key) => (
				<li key={key} className="flex flex-col gap-3">
					<div className="relative w-full pb-[100%]">
						{/* Same placeholder the Card shows while images load — keeps
						    the skeleton → real-card transition visually smooth. */}
						<Image
							src={PRODUCT_PLACEHOLDER_SRC}
							alt=""
							fill
							sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
							className="rounded object-cover"
						/>
					</div>
					<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
				</li>
			))}
		</ul>
	)
}
