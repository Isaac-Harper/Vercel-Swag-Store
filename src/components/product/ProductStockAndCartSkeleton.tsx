export function ProductStockAndCartSkeleton() {
	return (
		<>
			<div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
			<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
				<div className="h-14 w-20 animate-pulse rounded bg-gray-200" />
				<div className="h-11 w-full animate-pulse rounded bg-gray-200 sm:w-32" />
			</div>
		</>
	)
}
