'use client'

import { useRouter } from 'next/navigation'
import { Suspense, use, useCallback, useState } from 'react'
import { CartView } from '@/components/CartView'
import { CheckoutView } from '@/components/CheckoutView'
import type { CartItem } from '@/lib/cart'

type View = 'cart' | 'checkout'

export function CartPageInner({ itemsPromise }: { itemsPromise: Promise<CartItem[]> }) {
	const router = useRouter()
	const [view, setView] = useState<View>('cart')

	const goToCheckout = useCallback(() => setView('checkout'), [])
	const backToCart = useCallback(() => setView('cart'), [])
	const goHome = useCallback(() => router.push('/'), [router])

	return (
		<>
			<div className="mb-8 flex items-baseline justify-between">
				<h1 className="text-2xl sm:text-3xl font-bold">
					{view === 'cart' ? 'Cart' : 'Checkout'}
				</h1>
				{view === 'checkout' && (
					<button
						type="button"
						onClick={backToCart}
						className="cursor-pointer text-sm underline underline-offset-4 transition-opacity hover:opacity-70 active:opacity-50"
					>
						&larr; Back to cart
					</button>
				)}
			</div>
			<Suspense fallback={<CartLoading />}>
				<CartBody
					itemsPromise={itemsPromise}
					view={view}
					onCheckout={goToCheckout}
					onDone={goHome}
				/>
			</Suspense>
		</>
	)
}

function CartBody({
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

function CartLoading() {
	return (
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
	)
}
