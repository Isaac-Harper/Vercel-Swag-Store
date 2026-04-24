'use client'

import { createContext, Suspense, useContext, useState, type ReactNode } from 'react'
import { ProductStockHydrator } from '@/components/product/ProductStockHydrator'

type StockMap = Map<string, number>

const ProductStockContext = createContext<StockMap>(new Map())

export function useProductStockMap(): StockMap {
	return useContext(ProductStockContext)
}

/**
 * Holds the resolved product-stock map in state so `<Card>`s render with the
 * empty-map default immediately and re-render once `<ProductStockHydrator>`
 * resolves the promise. Empty map = stock unknown; `<Card>` treats missing
 * entries as "render normally, no badge".
 */
export function ProductStockProvider({
	stockPromise,
	children,
}: {
	stockPromise: Promise<StockMap>
	children: ReactNode
}) {
	const [stock, setStock] = useState<StockMap>(new Map())
	return (
		<ProductStockContext value={stock}>
			{children}
			<Suspense fallback={null}>
				<ProductStockHydrator promise={stockPromise} onLoad={setStock} />
			</Suspense>
		</ProductStockContext>
	)
}
