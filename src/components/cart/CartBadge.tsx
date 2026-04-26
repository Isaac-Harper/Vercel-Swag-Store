'use client'

import { useEffect } from 'react'
import { CartBag } from '@/components/cart/CartBag'
import { useCartCount } from '@/components/cart/CartCountProvider'

export function CartBadge({ initialCount }: { initialCount: number }) {
	const { delta, reportCount } = useCartCount()
	const count = initialCount + delta

	useEffect(() => {
		reportCount(count)
	}, [count, reportCount])

	return <CartBag itemCount={count} />
}
