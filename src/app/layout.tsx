import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Promo } from '@/components/Promo'

import './globals.css'

export const metadata: Metadata = {
	title: 'Monogram Next.js Starter Kit',
	description: 'Monogram Next.js Starter Kit',
	icons: {
		icon: '/favicon.svg',
	},
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>
				<Header />
				<Promo />
				<main className="flex-1">{children}</main>
				<Footer />
			</body>
		</html>
	)
}
