'use client'

import type { ButtonHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'

export function PendingButton({
	disabled,
	type = 'submit',
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	const { pending } = useFormStatus()
	// eslint-disable-next-line react/button-has-type
	return <button {...props} type={type} disabled={disabled || pending} />
}
