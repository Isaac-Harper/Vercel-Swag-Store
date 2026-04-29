'use client'

import Image from 'next/image'
import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react'
import { removeFromCart, updateCartQuantity } from '@/actions/cart'
import { useCartCount } from '@/components/cart/CartCountProvider'
import { useCartStockMap } from '@/components/cart/CartStockProvider'
import type { CartItem } from '@/types/cart'
import { formatPrice } from '@/lib/format'
import { cents } from '@/types/money'
import { PRODUCT_PLACEHOLDER_BLUR, PRODUCT_PLACEHOLDER_SRC } from '@/lib/image-placeholder'

type OptimisticAction =
	| { type: 'update'; id: string; quantity: number }
	| { type: 'remove'; id: string }

function applyAction(state: CartItem[], action: OptimisticAction): CartItem[] {
	if (action.type === 'remove') {
		return state.filter((item) => item.id !== action.id)
	}
	return state.map((item) =>
		item.id === action.id ? { ...item, quantity: action.quantity } : item
	)
}

type Pending = { target: number; promise: Promise<void> }

// Wait this long before sending the first request — clusters quick double-clicks
// into a single PATCH.
const LEADING_DEBOUNCE_MS = 100

export function CartView({
	items,
	onCheckoutAction,
}: {
	items: CartItem[]
	onCheckoutAction: () => void
}) {
	const [optimisticItems, applyOptimistic] = useOptimistic(items, applyAction)
	const { addOptimistic: addOptimisticCount } = useCartCount()
	const [, startTransition] = useTransition()
	const stockMap = useCartStockMap()
	const [error, setError] = useState<string | null>(null)

	// Coalesce rapid +/- clicks per line: a leading 100ms wait clusters a quick
	// double-click into one request; while one is in flight, additional clicks
	// just bump `target` and a single trailing request fires with the final value.
	const pendingRef = useRef<Map<string, Pending>>(new Map())
	const [pendingCount, setPendingCount] = useState(0)
	const isFlushing = pendingCount > 0

	// Quantities the user has committed (post-API-call) that haven't yet
	// reflected in the `items` prop. Server revalidation flows back via
	// Suspense after the action's `await` resolves, so without tracking this
	// we'd let the user open Checkout while `items` is one revision behind —
	// CartBody would then hand a stale subtotal to CheckoutView.
	const [unsynced, setUnsynced] = useState<Map<string, number>>(new Map())
	useEffect(() => {
		setUnsynced((prev) => {
			if (prev.size === 0) return prev
			const next = new Map<string, number>()
			let pruned = false
			prev.forEach((qty, id) => {
				const item = items.find((i) => i.id === id)
				const synced = qty <= 0 ? item === undefined : item?.quantity === qty
				if (synced) pruned = true
				else next.set(id, qty)
			})
			return pruned ? next : prev
		})
	}, [items])
	const isSyncing = isFlushing || unsynced.size > 0

	function scheduleSend(id: string, target: number): Promise<void> {
		const existing = pendingRef.current.get(id)
		if (existing) {
			existing.target = target
			return existing.promise
		}
		setPendingCount((n) => n + 1)
		const entry: Pending = { target, promise: Promise.resolve() }
		entry.promise = (async () => {
			try {
				await new Promise<void>((resolve) => {
					setTimeout(resolve, LEADING_DEBOUNCE_MS)
				})
				// Trailing-throttle: send target; if more clicks landed during the
				// request, the target changed and we loop to send the latest. Each
				// iteration must await before checking again — sequential by design.
				let lastSent = entry.target - 1
				let lastOk = true
				while (entry.target !== lastSent) {
					const t = entry.target
					// eslint-disable-next-line no-await-in-loop
					const result = t <= 0 ? await removeFromCart(id) : await updateCartQuantity(id, t)
					lastOk = result.ok
					lastSent = t
				}
				if (lastOk) setError(null)
				else setError("Couldn't update your cart. Please try again.")
				// Mark this id's committed quantity as awaiting reflection in `items`.
				// The `useEffect` above prunes the entry once revalidation lands.
				setUnsynced((prev) => new Map(prev).set(id, lastSent))
				pendingRef.current.delete(id)
			} finally {
				setPendingCount((n) => n - 1)
			}
		})()
		pendingRef.current.set(id, entry)
		return entry.promise
	}

	// Compute from optimistic quantity rather than the server's `lineTotal` —
	// the server total is stale while +/- clicks are pending.
	const subtotal = cents(
		optimisticItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	)

	return (
		<>
			<div className="flex-1 overflow-y-auto p-4">
				{error && (
					<p
						role="alert"
						className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
					>
						{error}
					</p>
				)}
				{optimisticItems.length === 0 ? (
					<p className="text-gray-600">Your cart is empty.</p>
				) : (
					<ul className="flex flex-col gap-4">
						{optimisticItems.map(({ id, product, quantity }) => {
							const image = product.images[0] ?? PRODUCT_PLACEHOLDER_SRC
							const stock = stockMap.get(product.id)
							const atStockCap = stock !== undefined && quantity >= stock

							function decrement() {
								const next = quantity - 1
								startTransition(async () => {
									if (next <= 0) {
										applyOptimistic({ type: 'remove', id })
										addOptimisticCount(-quantity)
									} else {
										applyOptimistic({ type: 'update', id, quantity: next })
										addOptimisticCount(-1)
									}
									await scheduleSend(id, next)
								})
							}

							function increment() {
								const next = quantity + 1
								startTransition(async () => {
									applyOptimistic({ type: 'update', id, quantity: next })
									addOptimisticCount(1)
									await scheduleSend(id, next)
								})
							}

							function remove() {
								startTransition(async () => {
									applyOptimistic({ type: 'remove', id })
									addOptimisticCount(-quantity)
									await scheduleSend(id, 0)
								})
							}

							return (
								<li key={id} className="flex gap-3">
									<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
										<Image
											src={image}
											alt={product.name}
											fill
											sizes="80px"
											placeholder="blur"
											blurDataURL={PRODUCT_PLACEHOLDER_BLUR}
											className="object-cover"
										/>
									</div>
									<div className="flex flex-1 flex-col justify-between">
										<div className="flex items-start justify-between gap-2">
											<div>
												<h3 className="font-medium">{product.name}</h3>
												<p className="text-sm text-gray-600">{formatPrice(cents(product.price))}</p>
											</div>
											<button
												type="button"
												onClick={remove}
												aria-label={`Remove ${product.name}`}
												className="cursor-pointer text-xs text-gray-600 transition-opacity hover:opacity-70 active:opacity-50"
											>
												Remove
											</button>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={decrement}
													aria-label={`Decrease ${product.name}`}
													className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-300 transition hover:opacity-70 active:opacity-50"
												>
													−
												</button>
												<span className="min-w-[1.5rem] text-center text-sm">{quantity}</span>
												<button
													type="button"
													onClick={increment}
													aria-label={`Increase ${product.name}`}
													disabled={atStockCap}
													className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-gray-300 transition hover:opacity-70 active:opacity-50 disabled:cursor-not-allowed disabled:opacity-30"
												>
													+
												</button>
											</div>
											<p className="text-sm">{formatPrice(cents(product.price * quantity))}</p>
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
					onClick={onCheckoutAction}
					className="w-full cursor-pointer rounded bg-black py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={optimisticItems.length === 0 || isSyncing}
				>
					{isSyncing ? 'Updating cart…' : 'Checkout'}
				</button>
			</div>
		</>
	)
}
