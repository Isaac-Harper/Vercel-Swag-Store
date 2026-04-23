export function SearchFormSkeleton() {
	return (
		<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
			<div className="h-10 flex-1 animate-pulse rounded bg-gray-100" />
			<div className="h-10 sm:w-48 animate-pulse rounded bg-gray-100" />
			<div className="h-10 w-24 animate-pulse rounded bg-gray-100" />
		</div>
	)
}
