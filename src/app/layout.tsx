import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['400'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Monogram Next.js Starter Kit',
	description: 'Monogram Next.js Starter Kit',
	icons: {
		icon: '/favicon.svg',
	},
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={inter.variable}>
			<body>{children}</body>
		</html>
	)
}
