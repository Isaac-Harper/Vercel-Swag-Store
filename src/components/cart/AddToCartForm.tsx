'use client'

import { useActionState, useOptimistic } from 'react'
import { addToCart, type AddToCartState } from '@/actions/cart'
import { useCartCount } from '@/components/cart/CartCountProvider'

const ERROR_MESSAGES: Record<Exclude<AddToCartState, null | { ok: true }>['reason'], string> = {
	'unknown-product': 'This product is no longer available. Try refreshing the page.',
}

const LOW_STOCK_THRESHOLD = 5

function getStockMessage(stock: number, available: number): string {
	if (stock === 0) return 'Out of stock'
	if (available === 0) return 'Maximum in cart'
	if (available <= LOW_STOCK_THRESHOLD) return `Only ${available} left in stock`
	return 'In stock'
}

export function AddToCartForm({
	slug,
	stock,
	available,
}: {
	slug: string
	stock: number
	available: number
}) {
	const { addOptimistic } = useCartCount()
	// Layered optimism: `available` is the server-truth (stock minus current
	// cart line) handed down by `<ProductStockAndCart>`. We layer a client
	// decrement on top so clicking Add drops the displayed count immediately,
	// without waiting for the action + revalidation round-trip. React resets
	// the baseline once the surrounding transition settles, by which point
	// the parent has re-rendered with a fresh `available`.
	const [optimisticAvailable, decrementAvailable] = useOptimistic(
		available,
		(current: number, delta: number) => Math.max(0, current - delta)
	)
	const outOfStock = optimisticAvailable <= 0
	const message = getStockMessage(stock, optimisticAvailable)
	const [state, formAction] = useActionState<AddToCartState, FormData>(
		addToCart.bind(null, slug),
		null
	)
	const errorMessage = state && !state.ok ? ERROR_MESSAGES[state.reason] : null

	function handleAction(formData: FormData) {
		const raw = Number(formData.get('quantity') ?? 1)
		const requested = Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 1
		const quantity = Math.min(requested, optimisticAvailable)
		if (quantity <= 0) return
		decrementAvailable(quantity)
		addOptimistic(quantity)
		formAction(formData)
	}

	return (
		<>
			<p className={`text-sm ${optimisticAvailable === 0 ? 'text-red-600' : 'text-gray-600'}`}>
				{message}
			</p>
			<form action={handleAction} className="mt-4 flex flex-col gap-3">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
					<label htmlFor="cart-qty" className="flex flex-col gap-1">
						<span className="form-label">Qty</span>
						<input
							id="cart-qty"
							name="quantity"
							type="number"
							min={1}
							max={optimisticAvailable || 1}
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
				</div>
				{errorMessage ? (
					<p role="alert" className="text-sm text-red-600">
						{errorMessage}
					</p>
				) : null}
			</form>
		</>
	)
}
