import Image from 'next/image'
import { cartItems } from '@/data/cart'

const subtotal = cartItems.reduce(
	(sum, item) => sum + item.product.price * item.quantity,
	0,
)

export function CartView({ onCheckout }: { onCheckout: () => void }) {
	return (
		<>
			<div className="flex-1 overflow-y-auto p-4">
				{cartItems.length === 0 ? (
					<p className="text-gray-500">Your cart is empty.</p>
				) : (
					<ul className="flex flex-col gap-4">
						{cartItems.map(({ product, quantity }) => (
							<li key={product.name} className="flex gap-3">
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
									<div>
										<h3 className="font-medium">{product.name}</h3>
										<p className="text-sm text-gray-500">Qty {quantity}</p>
									</div>
									<p className="text-sm">${product.price * quantity}</p>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className="border-t border-gray-200 p-4">
				<div className="mb-3 flex items-center justify-between text-sm">
					<span className="font-medium">Subtotal</span>
					<span className="font-medium">${subtotal}</span>
				</div>
				<button
					type="button"
					onClick={onCheckout}
					className="w-full rounded bg-black py-3 text-sm font-medium text-white disabled:opacity-50"
					disabled={cartItems.length === 0}
				>
					Checkout
				</button>
			</div>
		</>
	)
}
