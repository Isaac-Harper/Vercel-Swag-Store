import Image from 'next/image'
import { PRODUCT_PLACEHOLDER_SRC } from '@/lib/image-placeholder'

export function FeaturedSkeleton() {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 flex items-baseline justify-between gap-4">
					<h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
					<div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
				</div>
				<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
					{['a', 'b', 'c', 'd', 'e', 'f'].map((k) => (
						<li key={k} className="flex flex-col gap-3">
							<div className="relative w-full pb-[100%]">
								{/* Same placeholder the Card shows while images load —
								    keeps skeleton → real-card transition smooth. */}
								<Image
									src={PRODUCT_PLACEHOLDER_SRC}
									alt=""
									fill
									sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
									className="rounded object-cover"
								/>
							</div>
							<div className="flex items-center justify-between">
								<div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
								<div className="h-4 w-12 animate-pulse rounded bg-gray-100" />
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
