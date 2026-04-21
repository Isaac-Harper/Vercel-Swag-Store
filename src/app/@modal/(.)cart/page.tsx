import { CartDrawer } from '@/components/CartDrawer'
import { getCartItems } from '@/lib/cart'

export default function CartInterceptedPage() {
	// Pass the unawaited promise to the client drawer so the shell can render
	// instantly while items stream in via React's `use()` + Suspense.
	return <CartDrawer itemsPromise={getCartItems()} />
}
