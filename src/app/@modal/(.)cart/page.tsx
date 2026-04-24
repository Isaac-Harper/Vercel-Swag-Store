import { CartDrawer } from '@/components/cart/CartDrawer'
import { getCart, getCartStockMap } from '@/lib/api/cart'

export default function CartInterceptedPage() {
	// Two unawaited promises. Items resolve after one round-trip (the /cart
	// fetch) so the drawer paints the line list fast; stock trails behind its
	// own Suspense and decorates the items once the per-line lookups return.
	return <CartDrawer itemsPromise={getCart()} stockPromise={getCartStockMap()} />
}
