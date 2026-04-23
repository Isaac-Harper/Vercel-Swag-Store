'use client'

import { CartBag } from '@/components/cart/CartBag'
import { useCartCount } from '@/components/cart/CartCountProvider'

export function CartBadge({ initialCount }: { initialCount: number }) {
	const { delta } = useCartCount()
	const count = initialCount + delta
	return (
		<>
			<CartBag itemCount={count} />
			<span aria-live="polite" className="sr-only">
				{count} {count === 1 ? 'item' : 'items'} in cart
			</span>
		</>
	)
}
