'use client'

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useOptimistic,
	useRef,
	useState,
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
	/**
	 * Reports the current cart count so the provider's aria-live region only
	 * announces real changes (and not on every <CartBadge> remount, which
	 * happens during route transitions).
	 */
	reportCount: (count: number) => void
}

const CartCountContext = createContext<CartCountContextValue | null>(null)

export function CartCountProvider({ children }: { children: ReactNode }) {
	const [delta, addOptimisticInternal] = useOptimistic(
		0,
		(state: number, amount: number) => state + amount
	)

	const addOptimistic = useCallback(
		(amount: number) => {
			addOptimisticInternal(amount)
		},
		[addOptimisticInternal]
	)

	const previousCount = useRef<number | null>(null)
	const [announcement, setAnnouncement] = useState('')

	const reportCount = useCallback((count: number) => {
		if (previousCount.current !== null && previousCount.current !== count) {
			setAnnouncement(`${count} ${count === 1 ? 'item' : 'items'} in cart`)
		}
		previousCount.current = count
	}, [])

	const value = useMemo(
		() => ({ delta, addOptimistic, reportCount }),
		[delta, addOptimistic, reportCount]
	)

	return (
		<CartCountContext.Provider value={value}>
			{children}
			<span aria-live="polite" className="sr-only">
				{announcement}
			</span>
		</CartCountContext.Provider>
	)
}

export function useCartCount() {
	const ctx = useContext(CartCountContext)
	if (!ctx) throw new Error('useCartCount must be used within CartCountProvider')
	return ctx
}
