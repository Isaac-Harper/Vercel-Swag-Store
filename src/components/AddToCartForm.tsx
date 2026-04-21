'use client'

import { addToCart } from '@/actions/cart'
import { useCartCount } from '@/components/CartCountProvider'

export function AddToCartForm({
	slug,
	stock,
}: {
	slug: string
	stock: number
}) {
	const { addOptimistic } = useCartCount()
	const outOfStock = stock <= 0

	async function handleAction(formData: FormData) {
		const raw = Number(formData.get('quantity') ?? 1)
		const requested = Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 1
		const quantity = Math.min(requested, stock)
		if (quantity <= 0) return
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
					max={stock || 1}
					defaultValue={1}
					disabled={outOfStock}
					className="form-input w-20 disabled:cursor-not-allowed disabled:opacity-50"
				/>
			</label>
			<button
				type="submit"
				disabled={outOfStock}
				className="w-full cursor-pointer rounded bg-black py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-100 sm:w-auto sm:px-8"
			>
				{outOfStock ? 'Out of stock' : 'Add to cart'}
			</button>
		</form>
	)
}
