export function CartItemsSkeleton({ count = 2 }: { count?: number }) {
	const keys = Array.from({ length: count }, (_, i) => `cart-skeleton-${i}`)
	return (
		<ul className="flex flex-col gap-4">
			{keys.map((key) => (
				<li key={key} className="flex gap-3">
					<div className="h-20 w-20 shrink-0 animate-pulse rounded bg-gray-200" />
					<div className="flex flex-1 flex-col justify-between">
						<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
						<div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
					</div>
				</li>
			))}
		</ul>
	)
}
