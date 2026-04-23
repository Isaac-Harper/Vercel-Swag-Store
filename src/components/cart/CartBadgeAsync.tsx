import { CartBadge } from '@/components/cart/CartBadge'
import { getCartCount } from '@/lib/api/cart'

/**
 * Server-side fetch of the cart count, handed to `<CartBadge>` as the
 * baseline that client-side optimistic deltas are added on top of. Wrap in
 * Suspense at the call site so only the badge — not the whole layout — waits
 * on the cookie/cart fetch.
 */
export async function CartBadgeAsync() {
	const initialCount = await getCartCount()
	return <CartBadge initialCount={initialCount} />
}
