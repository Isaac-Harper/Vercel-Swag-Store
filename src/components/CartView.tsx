import Image from 'next/image'
import { removeFromCart, updateCartQuantity } from '@/actions/cart'
import { PendingButton } from '@/components/PendingButton'
import type { CartItem } from '@/lib/cart'
import { formatPrice } from '@/lib/format'

export function CartView({
	items,
	onCheckout,
}: {
	items: CartItem[]
	onCheckout: () => void
}) {
	const subtotal = items.reduce(
		(sum, item) => sum + item.product.price * item.quantity,
		0,
	)

	return (
		<>
			<div className="flex-1 overflow-y-auto p-4">
				{items.length === 0 ? (
					<p className="text-gray-500">Your cart is empty.</p>
				) : (
					<ul className="flex flex-col gap-4">
						{items.map(({ product, quantity }) => {
							const decrement = updateCartQuantity.bind(null, product.slug, quantity - 1)
							const increment = updateCartQuantity.bind(null, product.slug, quantity + 1)
							const remove = removeFromCart.bind(null, product.slug)
							const atStockCap = quantity >= product.stock
							return (
								<li key={product.slug} className="flex gap-3">
									<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
										{product.image ? (
											<Image
												src={product.image}
												alt={product.name}
												fill
												className="object-cover"
											/>
										) : (
											<div
												style={{ backgroundColor: product.color }}
												className="absolute inset-0"
											/>
										)}
									</div>
									<div className="flex flex-1 flex-col justify-between">
										<div className="flex items-start justify-between gap-2">
											<h3 className="font-medium">{product.name}</h3>
											<form action={remove}>
												<PendingButton
													type="submit"
													aria-label={`Remove ${product.name}`}
													className="cursor-pointer text-xs text-gray-500 transition-opacity hover:opacity-70 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
												>
													Remove
												</PendingButton>
											</form>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<form action={decrement}>
													<PendingButton
														type="submit"
														aria-label={`Decrease ${product.name}`}
														className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-300 transition hover:opacity-70 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-30"
													>
														−
													</PendingButton>
												</form>
												<span className="min-w-[1.5rem] text-center text-sm">{quantity}</span>
												<form action={increment}>
													<PendingButton
														type="submit"
														aria-label={`Increase ${product.name}`}
														disabled={atStockCap}
														className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-300 transition hover:opacity-70 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-30"
													>
														+
													</PendingButton>
												</form>
											</div>
											<p className="text-sm">{formatPrice(product.price * quantity)}</p>
										</div>
									</div>
								</li>
							)
						})}
					</ul>
				)}
			</div>
			<div className="border-t border-gray-200 p-4">
				<div className="mb-3 flex items-center justify-between text-sm">
					<span className="font-medium">Subtotal</span>
					<span className="font-medium">{formatPrice(subtotal)}</span>
				</div>
				<button
					type="button"
					onClick={onCheckout}
					className="w-full cursor-pointer rounded bg-black py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={items.length === 0}
				>
					Checkout
				</button>
			</div>
		</>
	)
}
