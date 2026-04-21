'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { CartView } from '@/components/CartView'
import { CheckoutView } from '@/components/CheckoutView'

type View = 'cart' | 'checkout'

export default function CartPage() {
	const router = useRouter()
	const [view, setView] = useState<View>('cart')

	const goToCheckout = useCallback(() => setView('checkout'), [])
	const backToCart = useCallback(() => setView('cart'), [])
	const goHome = useCallback(() => router.push('/'), [router])

	return (
		<section className="px-4 py-16">
			<div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col">
				<div className="mb-8 flex items-baseline justify-between">
					<h1 className="text-2xl sm:text-3xl font-bold">
						{view === 'cart' ? 'Cart' : 'Checkout'}
					</h1>
					{view === 'checkout' && (
						<button
							type="button"
							onClick={backToCart}
							className="cursor-pointer text-sm underline underline-offset-4"
						>
							&larr; Back to cart
						</button>
					)}
				</div>
				{view === 'cart' ? (
					<CartView onCheckout={goToCheckout} />
				) : (
					<CheckoutView onDoneAction={goHome} />
				)}
			</div>
		</section>
	)
}
