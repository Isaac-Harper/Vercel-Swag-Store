import { CartItemsSkeleton } from '@/components/cart/CartItemsSkeleton'

export default function CartLoading() {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col">
				<div className="mb-8">
					<div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
				</div>
				<CartItemsSkeleton />
			</div>
		</section>
	)
}
