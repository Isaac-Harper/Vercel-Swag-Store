'use client'

import Link from 'next/link'
import { useCallback, type AriaAttributes, type MouseEvent, type ReactNode } from 'react'
import { useSearchNav } from '@/components/search/SearchNavProvider'

type Props = {
	href: string
	current?: boolean
	disabled?: boolean
	children: ReactNode
} & AriaAttributes

/** Single link / disabled cell used by `<Pagination>`. */
export function PageLink({ href, current, disabled, children, ...rest }: Props) {
	const { startNav } = useSearchNav()
	// Route through `startNav` (useTransition) so `isPending` flips true
	// immediately — the results list swaps to the skeleton the moment the
	// user clicks, before the RSC round-trip. Modifier-keyed and non-left-button
	// clicks fall through to the Link's default behavior (open-in-new-tab etc.).
	const onClick = useCallback(
		(e: MouseEvent<HTMLAnchorElement>) => {
			if (e.defaultPrevented) return
			if (e.button !== 0) return
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
			e.preventDefault()
			startNav(href)
		},
		[href, startNav],
	)

	const className = `relative flex h-9 min-w-9 items-center justify-center rounded border px-3 text-sm transition ${
		current
			? 'border-black bg-black text-white'
			: 'border-gray-200 hover:border-gray-400'
	} ${disabled ? 'pointer-events-none opacity-40' : ''}`

	if (disabled) {
		return (
			<button type="button" disabled className={className} {...rest}>
				{children}
			</button>
		)
	}

	return (
		<Link href={href} className={className} onClick={onClick} {...rest}>
			{children}
		</Link>
	)
}
