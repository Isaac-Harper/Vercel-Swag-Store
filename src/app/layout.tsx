import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { CartCountProvider } from '@/components/CartCountProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Promo } from '@/components/Promo'
import { getCartCount } from '@/lib/cart'

import './globals.css'

export const metadata: Metadata = {
	title: 'Monogram Next.js Starter Kit',
	description: 'Monogram Next.js Starter Kit',
	icons: {
		icon: '/favicon.svg',
	},
}

export default async function RootLayout({
	children,
	modal,
}: {
	children: ReactNode
	modal: ReactNode
}) {
	const initialCartCount = await getCartCount()
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>
				<CartCountProvider initialCount={initialCartCount}>
					<Header />
					<Promo />
					<main className="flex-1">{children}</main>
					{modal}
					<Footer />
				</CartCountProvider>
			</body>
		</html>
	)
}
