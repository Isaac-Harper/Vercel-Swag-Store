import type { ReactNode } from 'react'
import { CartCountProvider } from '@/components/cart/CartCountProvider'
import { getCartCount } from '@/lib/api/cart'

export async function CartCountFromCookies({ children }: { children: ReactNode }) {
	const count = await getCartCount()
	return <CartCountProvider initialCount={count}>{children}</CartCountProvider>
}
