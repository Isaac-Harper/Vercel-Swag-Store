import { CartDrawer } from '@/components/CartDrawer'
import { getCartItems } from '@/lib/cart'

export default async function CartInterceptedPage() {
	const items = await getCartItems()
	return <CartDrawer items={items} />
}
