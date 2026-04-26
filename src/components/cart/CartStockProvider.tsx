'use client'

import { createContext, Suspense, useContext, useState, type ReactNode } from 'react'
import {
	CartStockHydrator,
	CartStockSetterContext,
} from '@/components/cart/CartStockHydrator'

type StockMap = Map<string, number>

const CartStockContext = createContext<StockMap>(new Map())

export function useCartStockMap(): StockMap {
	return useContext(CartStockContext)
}

/**
 * Holds the resolved stock map in state so `<CartView>` can render with the
 * empty-map default immediately and re-render once `<CartStockHydrator>`
 * resolves the promise and feeds the map in. Empty map = stock unknown; UI
 * treats missing entries as "no cap".
 */
export function CartStockProvider({
	stockPromise,
	children,
}: {
	stockPromise: Promise<StockMap>
	children: ReactNode
}) {
	const [stock, setStock] = useState<StockMap>(new Map())
	return (
		<CartStockContext value={stock}>
			<CartStockSetterContext value={setStock}>
				{children}
				<Suspense fallback={null}>
					<CartStockHydrator promise={stockPromise} />
				</Suspense>
			</CartStockSetterContext>
		</CartStockContext>
	)
}
