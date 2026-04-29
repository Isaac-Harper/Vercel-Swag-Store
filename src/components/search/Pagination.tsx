'use client'

import { useSearchParams } from 'next/navigation'
import { PageLink } from '@/components/search/PageLink'
import { useSearchNav } from '@/components/search/SearchNavProvider'

type Props = {
	pathname: string
	/** Other query params to preserve across page links (q, category, etc.). */
	baseParams: Record<string, string>
	totalPages: number
	/** Query key for the page number (default `page`). Page 1 is omitted. */
	pageParam?: string
}

/**
 * Client pagination. `currentPage` is read from `useSearchParams()` so the
 * highlighted cell updates the instant `<SearchNavProvider>` calls
 * `history.pushState`, rather than waiting for the RSC transition to commit.
 */
export function Pagination({ pathname, baseParams, totalPages, pageParam = 'page' }: Props) {
	const searchParams = useSearchParams()
	const { pendingHref } = useSearchNav()
	// Prefer the optimistic `pendingHref` set by `startNav` — `useSearchParams`
	// doesn't react to our sync `history.pushState`, so without this the
	// highlighted cell would lag behind the URL until the RSC commit.
	const activeParams = pendingHref
		? new URLSearchParams(pendingHref.split('?')[1] ?? '')
		: searchParams
	const raw = activeParams.get(pageParam) ?? '1'
	const parsed = Number.parseInt(raw, 10)
	const currentPage = Math.min(
		Math.max(1, Number.isFinite(parsed) ? parsed : 1),
		Math.max(1, totalPages)
	)

	if (totalPages <= 1) return null

	const buildHref = (page: number) => {
		const params = new URLSearchParams(baseParams)
		if (page > 1) params.set(pageParam, String(page))
		const qs = params.toString()
		return qs ? `${pathname}?${qs}` : pathname
	}

	const pages = pageNumbers(currentPage, totalPages)
	const hasPrev = currentPage > 1
	const hasNext = currentPage < totalPages

	return (
		<nav aria-label="Search results pages" className="mt-8 flex items-center justify-center gap-1">
			<PageLink href={buildHref(currentPage - 1)} disabled={!hasPrev} aria-label="Previous page">
				&larr;
			</PageLink>
			{pages.map((p, i) =>
				p === null ? (
					<span
						// eslint-disable-next-line react/no-array-index-key
						key={`gap-${i}`}
						aria-hidden
						className="px-2 text-sm text-gray-600"
					>
						…
					</span>
				) : (
					<PageLink
						key={p}
						href={buildHref(p)}
						current={p === currentPage}
						aria-label={`Page ${p}`}
						aria-current={p === currentPage ? 'page' : undefined}
					>
						{p}
					</PageLink>
				)
			)}
			<PageLink href={buildHref(currentPage + 1)} disabled={!hasNext} aria-label="Next page">
				&rarr;
			</PageLink>
		</nav>
	)
}

/**
 * Returns a compact list of pages with `null` placeholders for elided ranges.
 * E.g. for current=5 of 10 → [1, null, 4, 5, 6, null, 10].
 */
function pageNumbers(current: number, total: number): Array<number | null> {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

	const pages: Array<number | null> = [1]
	const start = Math.max(2, current - 1)
	const end = Math.min(total - 1, current + 1)
	if (start > 2) pages.push(null)
	for (let p = start; p <= end; p++) pages.push(p)
	if (end < total - 1) pages.push(null)
	pages.push(total)
	return pages
}
