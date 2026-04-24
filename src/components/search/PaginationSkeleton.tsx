/**
 * First-load placeholder for `<SearchPagination>`. Renders the same shape as
 * the real `<Pagination>` — arrows plus a few numbered cells — so the control
 * reads as pagination while the server resolves the total-pages count. Once
 * resolved, the real pagination stays visible across navigations (its
 * Suspense isn't keyed), so this only shows on the very first hit to /search.
 */
export function PaginationSkeleton() {
	const cellClass =
		'flex h-9 min-w-9 items-center justify-center rounded border border-gray-200 px-3 text-sm text-gray-400'
	return (
		<nav
			aria-label="Search results pages"
			className="mt-8 flex animate-pulse items-center justify-center gap-1"
		>
			<span aria-hidden className={cellClass}>
				&larr;
			</span>
			{[1, 2, 3].map((n) => (
				<span key={n} aria-hidden className={cellClass}>
					{n}
				</span>
			))}
			<span aria-hidden className={cellClass}>
				&rarr;
			</span>
		</nav>
	)
}
