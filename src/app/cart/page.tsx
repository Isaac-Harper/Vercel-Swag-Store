import { CartPageInner } from '@/components/CartPageInner'
import { getCartItems } from '@/lib/cart'

export default async function CartPage() {
	const items = await getCartItems()
	return (
		<section className="px-4 py-16">
			<div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col">
				<CartPageInner items={items} />
			</div>
		</section>
	)
}
