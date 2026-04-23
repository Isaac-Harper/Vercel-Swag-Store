'use client'

import dynamic from 'next/dynamic'
import { use } from 'react'
import { CartView } from '@/components/cart/CartView'
import type { CartItem } from '@/types/cart'

// Heavy form (zod, formatters, useActionState) only matters once the user
// clicks Checkout. Skip it from the initial cart bundle.
const CheckoutView = dynamic(
	() => import('@/components/cart/CheckoutView').then((m) => m.CheckoutView),
	{ ssr: false },
)

export type CartViewMode = 'cart' | 'checkout'

export function CartBody({
	itemsPromise,
	view,
	onCheckoutAction,
	onDoneAction,
}: {
	itemsPromise: Promise<CartItem[]>
	view: CartViewMode
	onCheckoutAction: () => void
	onDoneAction: () => void
}) {
	const items = use(itemsPromise)
	// Server-snapshot total — accurate at the moment we render the checkout
	// view. Once the user mutates the cart in CartView, optimistic updates
	// take over there.
	const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
	return view === 'cart' ? (
		<CartView items={items} onCheckoutAction={onCheckoutAction} />
	) : (
		<CheckoutView subtotal={subtotal} onDoneAction={onDoneAction} />
	)
}
