/**
 * First-load placeholder for `<SearchPagination>`. Once the pagination has
 * resolved at least once, the previous page's actual `<Pagination>` stays
 * visible across navigations (its Suspense isn't keyed), so this is only
 * shown on the very first hit to /search.
 */
export function PaginationSkeleton() {
	return (
		<nav
			aria-label="Search results pages"
			className="mt-8 flex items-center justify-center gap-1"
		>
			{['prev', 'p1', 'p2', 'p3', 'next'].map((k) => (
				<span
					key={k}
					aria-hidden
					className="h-9 min-w-9 animate-pulse rounded border border-gray-200 bg-gray-100 px-3"
				/>
			))}
		</nav>
	)
}
