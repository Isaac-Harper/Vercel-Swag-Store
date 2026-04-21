'use client'

import { addToCart } from '@/actions/cart'
import { useCartCount } from '@/components/CartCountProvider'

export function AddToCartForm({ slug }: { slug: string }) {
	const { addOptimistic } = useCartCount()

	async function handleAction(formData: FormData) {
		const raw = Number(formData.get('quantity') ?? 1)
		const quantity = Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 1
		addOptimistic(quantity)
		await addToCart(slug, formData)
	}

	return (
		<form action={handleAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
			<label htmlFor="cart-qty" className="flex flex-col gap-1">
				<span className="form-label">Qty</span>
				<input
					id="cart-qty"
					name="quantity"
					type="number"
					min={1}
					defaultValue={1}
					className="form-input w-20"
				/>
			</label>
			<button
				type="submit"
				className="w-full cursor-pointer rounded bg-black py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60 sm:w-auto sm:px-8"
			>
				Add to cart
			</button>
		</form>
	)
}
