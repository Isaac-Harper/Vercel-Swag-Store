'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { CartLinkPending } from '@/components/cart/CartLinkPending'

export function Header({ cartBadge }: { cartBadge: ReactNode }) {
	const pathname = usePathname()

	return (
		<header className="p-4">
			<nav className="flex items-center gap-4 sm:gap-8">
				<Link href="/" className="flex items-center gap-2 font-bold whitespace-nowrap">
					<svg
						aria-label="Vercel logomark"
						height="18"
						role="img"
						viewBox="0 0 74 64"
						className="text-current"
					>
						<path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor" />
					</svg>
					<span className="text-sm sm:text-base">Swag Store</span>
				</Link>
				<Link
					className="text-gray-600 hover:text-gray-800 active:text-black cursor-pointer"
					aria-current={pathname === '/' ? 'page' : undefined}
					href="/"
				>
					Home
				</Link>
				<Link
					className="text-gray-600 hover:text-gray-800 active:text-black cursor-pointer"
					aria-current={pathname === '/search' ? 'page' : undefined}
					href="/search"
				>
					Search
				</Link>
				<Link
					href="/cart"
					scroll={false}
					aria-current={pathname === '/cart' ? 'page' : undefined}
					className="ml-auto flex items-center gap-2 group"
				>
					{cartBadge}
					Cart
					<CartLinkPending />
				</Link>
			</nav>
		</header>
	)
}
