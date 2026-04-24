'use client'

import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useState } from 'react'
import { CartBody, type CartViewMode } from '@/components/cart/CartBody'
import { CartItemsSkeleton } from '@/components/cart/CartItemsSkeleton'
import type { CartItem } from '@/types/cart'

export function CartPageInner({
	itemsPromise,
	stockPromise,
}: {
	itemsPromise: Promise<CartItem[]>
	stockPromise: Promise<Map<string, number>>
}) {
	const router = useRouter()
	const [view, setView] = useState<CartViewMode>('cart')

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
			<h2 className="sr-only">{view === 'cart' ? 'Items' : 'Details'}</h2>
			<Suspense fallback={<CartItemsSkeleton />}>
				<CartBody
					itemsPromise={itemsPromise}
					stockPromise={stockPromise}
					view={view}
					onCheckoutAction={goToCheckout}
					onDoneAction={goHome}
				/>
			</Suspense>
		</>
	)
}
