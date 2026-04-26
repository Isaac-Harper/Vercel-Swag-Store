'use client'

import {
	startTransition,
	useActionState,
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type FormEvent,
} from 'react'
import { submitCheckout, type CheckoutState } from '@/actions/checkout'
import { Required } from '@/components/ui/Required'
import { usStates } from '@/data/usStates'
import { formatPrice } from '@/lib/format'
import type { Cents } from '@/types/money'

function formatCardNumber(value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 19)
	return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatZip(value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 9)
	return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function formatPhone(value: string) {
	const digits = value.replace(/\D/g, '').slice(0, 10)
	if (digits.length === 0) return ''
	if (digits.length <= 3) return `(${digits}`
	if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function formatExpiry(next: string, prev: string): string {
	let digits = next.replace(/\D/g, '')
	if (digits.length === 1 && /[2-9]/.test(digits)) {
		digits = `0${digits}`
	}
	if (digits.length >= 2) {
		const month = Number(digits.slice(0, 2))
		if (month < 1 || month > 12) return prev
	}
	digits = digits.slice(0, 4)
	return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

const statesPattern = usStates.map((s) => s.name).join('|')

const initialState: CheckoutState = { ok: false }

export function CheckoutView({
	subtotal,
	onDoneAction,
}: {
	subtotal: Cents
	onDoneAction: () => void
}) {
	const [state, formAction, pending] = useActionState(submitCheckout, initialState)
	const [cardNumber, setCardNumber] = useState('')
	const [expiry, setExpiry] = useState('')
	const [zip, setZip] = useState('')
	const [phone, setPhone] = useState('')
	const [cvc, setCvc] = useState('')
	// Synchronous guard: blocks duplicate submits before React's `pending` re-render
	// can disable the button (closes the rapid-double-click race window).
	const submittingRef = useRef(false)

	useEffect(() => {
		if (state.formError) setCvc('')
	}, [state])

	useEffect(() => {
		if (!pending) submittingRef.current = false
	}, [pending])

	function handleCardChange(e: ChangeEvent<HTMLInputElement>) {
		setCardNumber(formatCardNumber(e.target.value))
	}

	function handleExpiryChange(e: ChangeEvent<HTMLInputElement>) {
		const input = e.target
		const next = formatExpiry(input.value, expiry)
		setExpiry(next)

		const complete = /^\d{2}\/\d{2}$/.test(next)
		if (complete) {
			const [mm, yy] = next.split('/').map(Number)
			const now = new Date()
			const currentYY = now.getFullYear() % 100
			const currentMonth = now.getMonth() + 1
			const expired = yy < currentYY || (yy === currentYY && mm < currentMonth)
			input.setCustomValidity(expired ? 'Card is expired' : '')
		} else {
			input.setCustomValidity('')
		}
	}

	function handleZipChange(e: ChangeEvent<HTMLInputElement>) {
		setZip(formatZip(e.target.value))
	}

	function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
		setPhone(formatPhone(e.target.value))
	}

	function handleCvcChange(e: ChangeEvent<HTMLInputElement>) {
		setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (submittingRef.current || pending) return
		submittingRef.current = true
		// `formAction` from useActionState must run inside a transition so React
		// can track `pending`. We can't use `<form action={formAction}>` directly
		// because we still need the synchronous `submittingRef` dedupe to win
		// over rapid double-clicks before `pending` flips on the next render.
		const formData = new FormData(e.currentTarget)
		startTransition(() => formAction(formData))
	}

	if (state.ok) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl">
					✓
				</div>
				<h3 className="text-xl font-bold">Order placed!</h3>
				<p className="text-sm text-gray-600">
					Thanks for your purchase. A confirmation email is on its way.
				</p>
				<button
					type="button"
					onClick={onDoneAction}
					className="mt-4 w-full max-w-xs cursor-pointer rounded bg-black py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60"
				>
					Done
				</button>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
			<div className="flex-1 overflow-y-auto p-4">
				<fieldset className="mb-6 flex flex-col gap-3">
					<legend className="mb-2 text-sm font-semibold uppercase tracking-wide">Contact</legend>
					<label htmlFor="cart-email" className="flex flex-col gap-1">
						<span className="form-label">
							Email <Required />
						</span>
						<input
							id="cart-email"
							type="email"
							name="email"
							autoComplete="email"
							maxLength={254}
							required
							className="form-input"
						/>
					</label>
				</fieldset>

				<fieldset className="mb-6 flex flex-col gap-3">
					<legend className="mb-2 text-sm font-semibold uppercase tracking-wide">Shipping</legend>
					<div className="grid grid-cols-2 gap-3">
						<label htmlFor="cart-given-name" className="flex flex-col gap-1">
							<span className="form-label">
								First name <Required />
							</span>
							<input
								id="cart-given-name"
								name="given-name"
								autoComplete="given-name"
								maxLength={50}
								required
								className="form-input"
							/>
						</label>
						<label htmlFor="cart-family-name" className="flex flex-col gap-1">
							<span className="form-label">
								Last name <Required />
							</span>
							<input
								id="cart-family-name"
								name="family-name"
								autoComplete="family-name"
								maxLength={50}
								required
								className="form-input"
							/>
						</label>
					</div>
					<label htmlFor="cart-address-line1" className="flex flex-col gap-1">
						<span className="form-label">
							Address <Required />
						</span>
						<input
							id="cart-address-line1"
							name="address-line1"
							autoComplete="address-line1"
							maxLength={100}
							required
							className="form-input"
						/>
					</label>
					<label htmlFor="cart-address-line2" className="flex flex-col gap-1">
						<span className="form-label">Apartment, suite, etc. (optional)</span>
						<input
							id="cart-address-line2"
							name="address-line2"
							autoComplete="address-line2"
							maxLength={100}
							className="form-input"
						/>
					</label>
					<div className="grid grid-cols-2 gap-3">
						<label htmlFor="cart-address-level2" className="flex flex-col gap-1">
							<span className="form-label">
								City <Required />
							</span>
							<input
								id="cart-address-level2"
								name="address-level2"
								autoComplete="address-level2"
								maxLength={60}
								required
								className="form-input"
							/>
						</label>
						<label htmlFor="cart-address-level1" className="flex flex-col gap-1">
							<span className="form-label">
								State <Required />
							</span>
							<input
								id="cart-address-level1"
								name="address-level1"
								autoComplete="address-level1"
								list="us-states"
								pattern={statesPattern}
								title="Pick a valid US state"
								required
								placeholder="Start typing…"
								className="form-input"
							/>
							<datalist id="us-states">
								{usStates.map((s) => (
									<option key={s.code} value={s.name}>
										{s.name}
									</option>
								))}
							</datalist>
						</label>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<label htmlFor="cart-postal-code" className="flex flex-col gap-1">
							<span className="form-label">
								ZIP / Postal code <Required />
							</span>
							<input
								id="cart-postal-code"
								name="postal-code"
								autoComplete="postal-code"
								inputMode="numeric"
								maxLength={10}
								pattern="\d{5}(-\d{4})?"
								title="5-digit ZIP, or ZIP+4"
								value={zip}
								onChange={handleZipChange}
								required
								className="form-input"
							/>
						</label>
						<label htmlFor="cart-country" className="flex flex-col gap-1">
							<span className="form-label">
								Country <Required />
							</span>
							<input
								id="cart-country"
								name="country"
								autoComplete="country-name"
								defaultValue="United States"
								maxLength={60}
								required
								className="form-input"
							/>
						</label>
					</div>
					<label htmlFor="cart-tel" className="flex flex-col gap-1">
						<span className="form-label">Phone</span>
						<input
							id="cart-tel"
							type="tel"
							name="tel"
							autoComplete="tel"
							inputMode="tel"
							maxLength={14}
							pattern="\(\d{3}\) \d{3}-\d{4}"
							title="Enter a 10-digit US phone number"
							placeholder="(555) 123-4567"
							value={phone}
							onChange={handlePhoneChange}
							className="form-input"
						/>
					</label>
				</fieldset>

				<fieldset className="mb-6 flex flex-col gap-3">
					<legend className="mb-2 text-sm font-semibold uppercase tracking-wide">Payment</legend>
					<label htmlFor="cart-cc-number" className="flex flex-col gap-1">
						<span className="form-label">
							Card number <Required />
						</span>
						<input
							id="cart-cc-number"
							name="cc-number"
							autoComplete="cc-number"
							inputMode="numeric"
							maxLength={23}
							pattern="[\d\s]{13,23}"
							title="13–19 digit card number"
							placeholder="1234 5678 9012 3456"
							value={cardNumber}
							onChange={handleCardChange}
							required
							className="form-input font-mono tracking-wider"
						/>
					</label>
					<label htmlFor="cart-cc-name" className="flex flex-col gap-1">
						<span className="form-label">
							Name on card <Required />
						</span>
						<input
							id="cart-cc-name"
							name="cc-name"
							autoComplete="cc-name"
							maxLength={100}
							required
							className="form-input"
						/>
					</label>
					<div className="grid grid-cols-2 gap-3">
						<label htmlFor="cart-cc-exp" className="flex flex-col gap-1">
							<span className="form-label">
								Expiry (MM/YY) <Required />
							</span>
							<input
								id="cart-cc-exp"
								name="cc-exp"
								autoComplete="cc-exp"
								inputMode="numeric"
								maxLength={5}
								pattern="(0[1-9]|1[0-2])\/\d{2}"
								title="Use MM/YY"
								placeholder="MM/YY"
								value={expiry}
								onChange={handleExpiryChange}
								required
								className="form-input font-mono tracking-wider"
							/>
						</label>
						<label htmlFor="cart-cc-csc" className="flex flex-col gap-1">
							<span className="form-label">
								CVC <Required />
							</span>
							<input
								id="cart-cc-csc"
								name="cc-csc"
								autoComplete="cc-csc"
								inputMode="numeric"
								maxLength={4}
								pattern="\d{3,4}"
								title="3 or 4 digit security code"
								placeholder="123"
								value={cvc}
								onChange={handleCvcChange}
								required
								className="form-input"
							/>
						</label>
					</div>
				</fieldset>
			</div>
			<div className="border-t border-gray-200 p-4">
				<div className="mb-3 flex items-center justify-between text-sm">
					<span className="font-medium">Total</span>
					<span className="font-medium">{formatPrice(subtotal)}</span>
				</div>
				<button
					type="submit"
					disabled={pending}
					className="w-full cursor-pointer rounded bg-black py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-100"
				>
					{pending ? 'Placing order…' : 'Place order'}
				</button>

				{state.formError && (
					<p
						aria-live="polite"
						className="mt-3 rounded border border-red-300 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
					>
						{state.formError}
					</p>
				)}
			</div>
		</form>
	)
}
