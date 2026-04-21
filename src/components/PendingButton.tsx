'use client'

import type { ButtonHTMLAttributes } from 'react'
import { useFormStatus } from 'react-dom'

export function PendingButton({
	disabled,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	const { pending } = useFormStatus()
	return <button {...props} disabled={disabled || pending} />
}
