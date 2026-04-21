'use client'

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useOptimistic,
	type ReactNode,
} from 'react'

type CartCountContextValue = {
	count: number
	addOptimistic: (amount: number) => void
}

const CartCountContext = createContext<CartCountContextValue | null>(null)

export function CartCountProvider({
	initialCount,
	children,
}: {
	initialCount: number
	children: ReactNode
}) {
	const [count, addOptimisticInternal] = useOptimistic(
		initialCount,
		(state: number, amount: number) => state + amount,
	)

	const addOptimistic = useCallback(
		(amount: number) => {
			addOptimisticInternal(amount)
		},
		[addOptimisticInternal],
	)

	const value = useMemo(() => ({ count, addOptimistic }), [count, addOptimistic])

	return <CartCountContext.Provider value={value}>{children}</CartCountContext.Provider>
}

export function useCartCount() {
	const ctx = useContext(CartCountContext)
	if (!ctx) throw new Error('useCartCount must be used within CartCountProvider')
	return ctx
}
