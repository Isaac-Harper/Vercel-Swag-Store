'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Prefetches the given hrefs immediately on mount, instead of waiting for the
 * default `<Link>` viewport-intersection trigger. Use sparingly — every entry
 * costs a static-shell fetch, so reserve for short lists where any link is
 * likely to be clicked.
 */
export function EagerPrefetch({ hrefs }: { hrefs: string[] }) {
	const router = useRouter()
	useEffect(() => {
		for (const href of hrefs) router.prefetch(href)
	}, [router, hrefs])
	return null
}
