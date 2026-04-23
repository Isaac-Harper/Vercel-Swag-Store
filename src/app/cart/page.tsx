import type { Metadata } from 'next'
import { CartPageInner } from '@/components/cart/CartPageInner'
import { getCartWithStock } from '@/lib/api/cart'

export const metadata: Metadata = {
	title: 'Cart',
	description: 'Review the items in your cart and continue to checkout.',
	alternates: { canonical: '/cart' },
	robots: { index: false, follow: false },
	openGraph: {
		title: 'Cart',
		description: 'Review the items in your cart and continue to checkout.',
		url: '/cart',
	},
}

export default function CartPage() {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col">
				<CartPageInner itemsPromise={getCartWithStock()} />
			</div>
		</section>
	)
}
