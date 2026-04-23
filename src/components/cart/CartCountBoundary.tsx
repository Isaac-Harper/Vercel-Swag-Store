import { Suspense, type ReactNode } from 'react'
import { CartCountFromCookies } from '@/components/cart/CartCountFromCookies'
import { CartCountProvider } from '@/components/cart/CartCountProvider'

export function CartCountBoundary({ children }: { children: ReactNode }) {
	return (
		<Suspense
			fallback={<CartCountProvider initialCount={0}>{children}</CartCountProvider>}
		>
			<CartCountFromCookies>{children}</CartCountFromCookies>
		</Suspense>
	)
}
