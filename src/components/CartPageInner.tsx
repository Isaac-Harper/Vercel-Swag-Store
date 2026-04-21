'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { CartView } from '@/components/CartView'
import { CheckoutView } from '@/components/CheckoutView'
import type { CartItem } from '@/lib/cart'

type View = 'cart' | 'checkout'

export function CartPageInner({ items }: { items: CartItem[] }) {
	const router = useRouter()
	const [view, setView] = useState<View>('cart')

	const goToCheckout = useCallback(() => setView('checkout'), [])
	const backToCart = useCallback(() => setView('cart'), [])
	const goHome = useCallback(() => router.push('/'), [router])

	const subtotal = items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	)

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
			{view === 'cart' ? (
				<CartView items={items} onCheckout={goToCheckout} />
			) : (
				<CheckoutView subtotal={subtotal} onDoneAction={goHome} />
			)}
		</>
	)
}
