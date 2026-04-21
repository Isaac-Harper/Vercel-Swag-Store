import { Suspense, type ReactNode } from 'react'
import { CartCountProvider } from '@/components/CartCountProvider'
import { getCartCount } from '@/lib/cart'

async function CartCountFromCookies({ children }: { children: ReactNode }) {
	const count = await getCartCount()
	return <CartCountProvider initialCount={count}>{children}</CartCountProvider>
}

export function CartCountBoundary({ children }: { children: ReactNode }) {
	return (
		<Suspense
			fallback={<CartCountProvider initialCount={0}>{children}</CartCountProvider>}
		>
			<CartCountFromCookies>{children}</CartCountFromCookies>
		</Suspense>
	)
}
