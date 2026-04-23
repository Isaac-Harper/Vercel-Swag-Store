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
	/**
	 * Sum of pending optimistic adjustments not yet reflected in the
	 * server-rendered count. Resets to 0 once the surrounding transition
	 * (typically a server-action form submission) completes and revalidation
	 * delivers a fresh server count to `<CartBadge>`.
	 */
	delta: number
	addOptimistic: (amount: number) => void
}

const CartCountContext = createContext<CartCountContextValue | null>(null)

export function CartCountProvider({ children }: { children: ReactNode }) {
	const [delta, addOptimisticInternal] = useOptimistic(
		0,
		(state: number, amount: number) => state + amount,
	)

	const addOptimistic = useCallback(
		(amount: number) => {
			addOptimisticInternal(amount)
		},
		[addOptimisticInternal],
	)

	const value = useMemo(() => ({ delta, addOptimistic }), [delta, addOptimistic])

	return <CartCountContext.Provider value={value}>{children}</CartCountContext.Provider>
}

export function useCartCount() {
	const ctx = useContext(CartCountContext)
	if (!ctx) throw new Error('useCartCount must be used within CartCountProvider')
	return ctx
}
