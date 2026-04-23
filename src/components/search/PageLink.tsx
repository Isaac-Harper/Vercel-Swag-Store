import Link from 'next/link'
import type { AriaAttributes, ReactNode } from 'react'

type Props = {
	href: string
	current?: boolean
	disabled?: boolean
	children: ReactNode
} & AriaAttributes

/** Single link / disabled cell used by `<Pagination>`. */
export function PageLink({ href, current, disabled, children, ...rest }: Props) {
	const className = `flex h-9 min-w-9 items-center justify-center rounded border px-3 text-sm transition ${
		current
			? 'border-black bg-black text-white'
			: 'border-gray-200 hover:border-gray-400'
	} ${disabled ? 'pointer-events-none opacity-40' : ''}`

	if (disabled) {
		return (
			<span aria-disabled className={className} {...rest}>
				{children}
			</span>
		)
	}

	return (
		<Link href={href} className={className} {...rest}>
			{children}
		</Link>
	)
}
