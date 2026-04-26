'use client'

import dynamic from 'next/dynamic'
import { use } from 'react'
import { CartStockProvider } from '@/components/cart/CartStockProvider'
import { CartView } from '@/components/cart/CartView'
import type { CartItem } from '@/types/cart'
import { cents } from '@/types/money'

// Heavy form (zod, formatters, useActionState) only matters once the user
// clicks Checkout. Skip it from the initial cart bundle.
const CheckoutView = dynamic(() =>
	import('@/components/cart/CheckoutView').then((m) => m.CheckoutView),
)

export type CartViewMode = 'cart' | 'checkout'

export function CartBody({
	itemsPromise,
	stockPromise,
	view,
	onCheckoutAction,
	onDoneAction,
}: {
	itemsPromise: Promise<CartItem[]>
	stockPromise: Promise<Map<string, number>>
	view: CartViewMode
	onCheckoutAction: () => void
	onDoneAction: () => void
}) {
	const items = use(itemsPromise)
	// Server-snapshot total — accurate at the moment we render the checkout
	// view. Once the user mutates the cart in CartView, optimistic updates
	// take over there.
	const subtotal = cents(items.reduce((sum, item) => sum + item.lineTotal, 0))
	return view === 'cart' ? (
		<CartStockProvider stockPromise={stockPromise}>
			<CartView items={items} onCheckoutAction={onCheckoutAction} />
		</CartStockProvider>
	) : (
		<CheckoutView subtotal={subtotal} onDoneAction={onDoneAction} />
	)
}
