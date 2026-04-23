export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
	const keys = Array.from({ length: count }, (_, i) => `search-skeleton-${i}`)
	return (
		<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
			{keys.map((key) => (
				<li key={key} className="flex flex-col gap-3">
					<div className="relative w-full pb-[100%]">
						<div className="absolute inset-0 animate-pulse rounded bg-gray-200" />
					</div>
					<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
				</li>
			))}
		</ul>
	)
}
