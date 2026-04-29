'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useLinkStatus } from 'next/link'
import { useEffect, useState } from 'react'
import { CartItemsSkeleton } from '@/components/cart/CartItemsSkeleton'

/**
 * Renders an optimistic skeleton drawer the moment a navigation to `/cart`
 * starts. Lives **inside** the `<Link>` whose status it reads (per the
 * `useLinkStatus` contract), so the parent in `<Header>` is the cart link.
 * Disappears as soon as the real `<CartDrawer>` from the `@modal/(.)cart`
 * route paints — purely a perceived-latency win.
 *
 * Uses Radix `Dialog` so the transient skeleton gets the same focus trap,
 * scroll lock, inert background, and focus-restore-on-close as the real
 * drawer. Without this a screen reader / keyboard user can tab into
 * background content during the navigation window.
 */
export function CartLinkPending() {
	const { pending } = useLinkStatus()
	const [dismissed, setDismissed] = useState(false)

	// Reset dismissal once the navigation settles so the next click can
	// show the skeleton again.
	useEffect(() => {
		if (!pending) setDismissed(false)
	}, [pending])

	const open = pending && !dismissed

	return (
		<Dialog.Root open={open} onOpenChange={(next) => !next && setDismissed(true)}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
				<Dialog.Content className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white text-black shadow-xl outline-none md:max-w-lg">
					<Dialog.Description className="sr-only">Loading your cart.</Dialog.Description>
					<div className="flex items-center justify-between border-b border-gray-200 p-4">
						<Dialog.Title className="text-lg font-bold">Cart</Dialog.Title>
						<Dialog.Close asChild>
							<button
								type="button"
								aria-label="Close"
								className="cursor-pointer text-2xl leading-none transition-opacity hover:opacity-70 active:opacity-50"
							>
								<span aria-hidden>&times;</span>
							</button>
						</Dialog.Close>
					</div>
					<div className="flex-1 overflow-y-auto p-4">
						<CartItemsSkeleton />
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
