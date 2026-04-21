'use client'

import Link from 'next/link'
import { CartBag } from '@/components/CartBag'
import { useCartCount } from '@/components/CartCountProvider'

export function Header() {
	const { count } = useCartCount()
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
					<span className="hidden sm:inline">Swag Store</span>
				</Link>
				<Link
					className="text-gray-400 hover:text-gray-600 active:text-black cursor-pointer"
					aria-current="page"
					href="/"
				>
					Home
				</Link>
				<Link
					className="text-gray-400 hover:text-gray-600 active:text-black cursor-pointer"
					href="/search"
				>
					Search
				</Link>
				<Link href="/cart" className="ml-auto flex items-center gap-2 group">
					<CartBag itemCount={count} />
					Cart
				</Link>
			</nav>
		</header>
	)
}
