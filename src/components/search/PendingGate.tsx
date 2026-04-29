'use client'

import { type ReactNode } from 'react'
import { useSearchNav } from '@/components/search/SearchNavProvider'

/**
 * Renders `fallback` while a pagination / filter transition is in flight,
 * `children` otherwise. Sits between `<SearchNavProvider>` and the results
 * list so the skeleton appears the instant the user clicks a page link,
 * regardless of whether the data for the next page is already cached.
 */
export function PendingGate({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
	const { isPending } = useSearchNav()
	return isPending ? fallback : children
}
