'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useState } from 'react'
import { CartBody, type CartViewMode } from '@/components/cart/CartBody'
import { CartItemsSkeleton } from '@/components/cart/CartItemsSkeleton'
import type { CartItem } from '@/types/cart'

export function CartDrawer({
	itemsPromise,
	stockPromise,
}: {
	itemsPromise: Promise<CartItem[]>
	stockPromise: Promise<Map<string, number>>
}) {
	const router = useRouter()
	const [view, setView] = useState<CartViewMode>('cart')

	const close = useCallback(() => {
		// Reset view BEFORE navigating away. If Next.js's router cache keeps
		// this drawer tree alive across open/close, the next open lands on
		// `<CartView>` and `<CheckoutView>` is unmounted — discarding any
		// stale `state.ok` from a previous successful order. (If the tree is
		// fully unmounted instead, this is a harmless no-op since `useState`
		// re-initializes to `'cart'` anyway.)
		setView('cart')
		router.back()
	}, [router])

	const backToCart = useCallback(() => {
		setView('cart')
	}, [])

	const goToCheckout = useCallback(() => {
		setView('checkout')
	}, [])

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) close()
		},
		[close]
	)

	return (
		<Dialog.Root open onOpenChange={handleOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
				<Dialog.Content className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white text-black shadow-xl outline-none md:max-w-lg">
					<Dialog.Description className="sr-only">
						{view === 'cart'
							? 'Review the items in your cart and continue to checkout.'
							: 'Enter your shipping and payment details to complete your order.'}
					</Dialog.Description>
					<div className="flex items-center justify-between border-b border-gray-200 p-4">
						{view === 'checkout' ? (
							<>
								<button
									type="button"
									onClick={backToCart}
									className="cursor-pointer text-sm underline underline-offset-4 transition-opacity hover:opacity-70 active:opacity-50"
								>
									&larr; Back
								</button>
								<Dialog.Title className="text-lg font-bold">Checkout</Dialog.Title>
							</>
						) : (
							<Dialog.Title className="text-lg font-bold">Cart</Dialog.Title>
						)}
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

					<Suspense
						fallback={
							<div className="flex-1 overflow-y-auto p-4">
								<CartItemsSkeleton />
							</div>
						}
					>
						<CartBody
							itemsPromise={itemsPromise}
							stockPromise={stockPromise}
							view={view}
							onCheckoutAction={goToCheckout}
							onDoneAction={close}
						/>
					</Suspense>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
