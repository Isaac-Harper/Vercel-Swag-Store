'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { Suspense, use, useCallback, useState } from 'react'
import { CartView } from '@/components/CartView'
import { CheckoutView } from '@/components/CheckoutView'
import type { CartItem } from '@/lib/cart'

type View = 'cart' | 'checkout'

export function CartDrawer({ itemsPromise }: { itemsPromise: Promise<CartItem[]> }) {
	const router = useRouter()
	const [view, setView] = useState<View>('cart')

	const close = useCallback(() => {
		router.back()
	}, [router])

	const backToCart = useCallback(() => {
		setView('cart')
	}, [])

	const goToCheckout = useCallback(() => {
		setView('checkout')
	}, [])

	function handleOpenChange(open: boolean) {
		if (!open) close()
	}

	return (
		<Dialog.Root open onOpenChange={handleOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
				<Dialog.Content className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white text-black shadow-xl outline-none">
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
								&times;
							</button>
						</Dialog.Close>
					</div>

					<Suspense fallback={<DrawerBodyLoading />}>
						<DrawerBody
							itemsPromise={itemsPromise}
							view={view}
							onCheckout={goToCheckout}
							onDone={close}
						/>
					</Suspense>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

function DrawerBody({
	itemsPromise,
	view,
	onCheckout,
	onDone,
}: {
	itemsPromise: Promise<CartItem[]>
	view: View
	onCheckout: () => void
	onDone: () => void
}) {
	const items = use(itemsPromise)
	const subtotal = items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	)
	return view === 'cart' ? (
		<CartView items={items} onCheckout={onCheckout} />
	) : (
		<CheckoutView subtotal={subtotal} onDoneAction={onDone} />
	)
}

function DrawerBodyLoading() {
	return (
		<div className="flex-1 overflow-y-auto p-4">
			<ul className="flex flex-col gap-4">
				{Array.from({ length: 2 }).map((_, i) => (
					<li key={i} className="flex gap-3">
						<div className="h-20 w-20 shrink-0 animate-pulse rounded bg-gray-200" />
						<div className="flex flex-1 flex-col justify-between">
							<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
							<div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
