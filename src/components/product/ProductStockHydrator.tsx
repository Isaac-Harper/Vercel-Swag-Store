import { createContext, use, useContext, useEffect } from 'react'

type StockMap = Map<string, number>

export const ProductStockSetterContext = createContext<(map: StockMap) => void>(
	() => {},
)

/**
 * Suspends on `use(promise)` and writes the resolved map into provider state
 * via `ProductStockSetterContext`. Rendered inside `<ProductStockProvider>`
 * behind a `<Suspense fallback={null}>` so the card grid paints before stock
 * arrives.
 */
export function ProductStockHydrator({
	promise,
}: {
	promise: Promise<StockMap>
}) {
	const setStock = useContext(ProductStockSetterContext)
	const map = use(promise)
	useEffect(() => {
		setStock(map)
	}, [map, setStock])
	return null
}
