'use client'

import { useLinkStatus } from 'next/link'

/**
 * Renders a subtle pulsing overlay on a parent `<Link>` while the navigation
 * triggered by that link is in flight. Must be placed inside the `<Link>`
 * whose status it should reflect.
 */
export function LinkPending() {
	const { pending } = useLinkStatus()
	if (!pending) return null
	return (
		<span
			aria-hidden
			className="absolute inset-0 animate-pulse rounded bg-current opacity-10"
		/>
	)
}
