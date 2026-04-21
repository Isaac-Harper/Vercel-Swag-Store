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

const SITE_NAME = 'Vercel Swag Store'
const SITE_DESCRIPTION =
	'Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love.'
const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_NAME,
		template: `%s — ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	icons: {
		icon: '/favicon.svg',
	},
	openGraph: {
		type: 'website',
		siteName: SITE_NAME,
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: '/',
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
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
