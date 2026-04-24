import { use, useEffect } from 'react'

/**
 * Suspends on `use(promise)`; on resolve, pushes the resolved map into
 * parent state via `onLoad`. Rendered inside `<CartStockProvider>` behind a
 * `<Suspense fallback={null}>` so the rest of the cart paints before stock
 * arrives.
 *
 * Intentionally no `'use client'` directive — this is a universal module
 * imported only by the client `<CartStockProvider>`, so Next treats it as
 * a client-transitive module. That sidesteps Next's serialization check
 * for function props on client entry files and lets us keep the honest
 * `onLoad` name (it's a plain `setState`, not a Server Action).
 */
export function CartStockHydrator({
	promise,
	onLoad,
}: {
	promise: Promise<Map<string, number>>
	onLoad: (map: Map<string, number>) => void
}) {
	const map = use(promise)
	useEffect(() => {
		onLoad(map)
	}, [map, onLoad])
	return null
}
