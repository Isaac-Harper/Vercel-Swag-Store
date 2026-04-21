'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { CartView } from '@/components/CartView'
import { CheckoutView } from '@/components/CheckoutView'

type View = 'cart' | 'checkout'

export function CartDrawer() {
	const router = useRouter()
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [view, setView] = useState<View>('cart')

	useEffect(() => {
		if (!dialogRef.current?.open) {
			dialogRef.current?.showModal()
		}
	}, [])

	const close = useCallback(() => {
		router.back()
	}, [router])

	const backToCart = useCallback(() => {
		setView('cart')
	}, [])

	const goToCheckout = useCallback(() => {
		setView('checkout')
	}, [])

	const handleBackdropClick = useCallback(
		(e: MouseEvent<HTMLDialogElement>) => {
			if (e.target === dialogRef.current) close()
		},
		[close]
	)

	return (
		<dialog
			ref={dialogRef}
			onClose={close}
			onClick={handleBackdropClick}
			className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-white text-black shadow-xl backdrop:bg-black/40"
		>
			<div className="flex h-full flex-col">
				<div className="flex items-center justify-between border-b border-gray-200 p-4">
					{view === 'checkout' ? (
						<>
							<button
								type="button"
								onClick={backToCart}
								className="cursor-pointer text-sm underline underline-offset-4"
							>
								&larr; Back
							</button>
							<h2 className="text-lg font-bold">Checkout</h2>
						</>
					) : (
						<h2 className="text-lg font-bold">Cart</h2>
					)}
					<button
						type="button"
						onClick={close}
						aria-label="Close"
						className="cursor-pointer text-2xl leading-none"
					>
						&times;
					</button>
				</div>

				{view === 'cart' ? (
					<CartView onCheckout={goToCheckout} />
				) : (
					<CheckoutView onDoneAction={close} />
				)}
			</div>
		</dialog>
	)
}
