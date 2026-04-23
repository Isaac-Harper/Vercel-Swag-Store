'use client'

import { useLinkStatus } from 'next/link'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { CartItemsSkeleton } from '@/components/cart/CartItemsSkeleton'

/**
 * Renders an optimistic skeleton drawer the moment a navigation to `/cart`
 * starts. Lives **inside** the `<Link>` whose status it reads (per the
 * `useLinkStatus` contract), so the parent in `<Header>` is the cart link.
 * Disappears as soon as the real `<CartDrawer>` from the `@modal/(.)cart`
 * route paints — it's purely a perceived-latency win.
 */
export function CartLinkPending() {
	const { pending } = useLinkStatus()
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!pending || !mounted) return null

	return createPortal(
		<div aria-hidden>
			<div className="fixed inset-0 z-40 bg-black/40" />
			<div className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white text-black shadow-xl">
				<div className="flex items-center justify-between border-b border-gray-200 p-4">
					<span className="text-lg font-bold">Cart</span>
				</div>
				<div className="flex-1 overflow-y-auto p-4">
					<CartItemsSkeleton />
				</div>
			</div>
		</div>,
		document.body,
	)
}
