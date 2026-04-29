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
	const [dismissed, setDismissed] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	// If the navigation settles, clear any prior dismissal so the next click
	// can show the portal again.
	useEffect(() => {
		if (!pending) setDismissed(false)
	}, [pending])

	useEffect(() => {
		if (!pending || dismissed) return
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') setDismissed(true)
		}
		window.addEventListener('keydown', onKey)
		return () => {
			window.removeEventListener('keydown', onKey)
		}
	}, [pending, dismissed])

	if (!pending || !mounted || dismissed) return null

	return createPortal(
		<div>
			<button
				type="button"
				aria-label="Close"
				onClick={() => setDismissed(true)}
				className="fixed inset-0 z-40 cursor-default bg-black/40"
			/>
			<div
				role="dialog"
				aria-label="Cart"
				className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white text-black shadow-xl"
			>
				<div className="flex items-center justify-between border-b border-gray-200 p-4">
					<span className="text-lg font-bold">Cart</span>
					<button
						type="button"
						aria-label="Close"
						onClick={() => setDismissed(true)}
						className="cursor-pointer text-2xl leading-none transition-opacity hover:opacity-70 active:opacity-50"
					>
						<span aria-hidden>&times;</span>
					</button>
				</div>
				<div className="flex-1 overflow-y-auto p-4">
					<CartItemsSkeleton />
				</div>
			</div>
		</div>,
		document.body
	)
}
