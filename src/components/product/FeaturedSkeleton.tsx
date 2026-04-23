export function FeaturedSkeleton() {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 flex items-baseline justify-between gap-4">
					<h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>
				</div>
				<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
					{['a', 'b', 'c', 'd'].map((k) => (
						<li key={k} className="flex flex-col gap-3">
							<div className="relative w-full pb-[100%]">
								<div className="absolute inset-0 animate-pulse rounded bg-gray-100" />
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
