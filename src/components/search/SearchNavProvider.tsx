'use client'

import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	useTransition,
	type ReactNode,
} from 'react'

type SearchNav = {
	startNav: (href: string) => void
	isPending: boolean
	/** The href we're transitioning to, or `null` if idle. Consumers use this
	 *  for optimistic UI — e.g. `<Pagination>` highlights the target page from
	 *  this before the RSC commit lands, since `useSearchParams()` doesn't
	 *  observe direct `window.history.pushState` calls. */
	pendingHref: string | null
}

const SearchNavContext = createContext<SearchNav>({
	startNav: () => {},
	isPending: false,
	pendingHref: null,
})

export function useSearchNav(): SearchNav {
	return useContext(SearchNavContext)
}

/**
 * Client-side wrapper that converts pagination clicks into a `useTransition`
 * soft-nav. `isPending` flips true the instant the user clicks (before the
 * RSC round-trip / React commit), so `<PendingGate>` can swap the results
 * list for the skeleton immediately. Without this, the keyed `<Suspense>`
 * in `<SearchResults>` doesn't fire its fallback when `listProductsPaginated`
 * is cached (the server returns instantly, so the client never suspends).
 */
export function SearchNavProvider({ children }: { children: ReactNode }) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [pendingHref, setPendingHref] = useState<string | null>(null)

	const startNav = useCallback(
		(href: string) => {
			setPendingHref(href)
			// Update the address bar synchronously so the user sees the new page
			// number the instant they click. `router.push` inside a transition
			// defers its history write until commit, which makes the URL lag
			// behind the skeleton.
			window.history.pushState(null, '', href)
			startTransition(() => {
				router.push(href as Route, { scroll: false })
			})
		},
		[router],
	)

	// Clear the optimistic href once the transition commits — after that,
	// `useSearchParams()` returns authoritative values everywhere.
	useEffect(() => {
		if (!isPending) setPendingHref(null)
	}, [isPending])

	return (
		<SearchNavContext value={{ startNav, isPending, pendingHref }}>
			{children}
		</SearchNavContext>
	)
}
