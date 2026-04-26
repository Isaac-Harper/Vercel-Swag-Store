import { createContext, use, useContext, useEffect } from 'react'

type StockMap = Map<string, number>

export const CartStockSetterContext = createContext<(map: StockMap) => void>(
	() => {},
)

/**
 * Suspends on `use(promise)` and writes the resolved map into provider state
 * via `CartStockSetterContext`. Rendered inside `<CartStockProvider>` behind a
 * `<Suspense fallback={null}>` so the rest of the cart paints before stock
 * arrives.
 */
export function CartStockHydrator({
	promise,
}: {
	promise: Promise<StockMap>
}) {
	const setStock = useContext(CartStockSetterContext)
	const map = use(promise)
	useEffect(() => {
		setStock(map)
	}, [map, setStock])
	return null
}
