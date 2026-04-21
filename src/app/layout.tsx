import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { CartCountBoundary } from '@/components/CartCountBoundary'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Promo } from '@/components/Promo'

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

export default function RootLayout({
	children,
	modal,
}: {
	children: ReactNode
	modal: ReactNode
}) {
	return (
		<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white"
				>
					Skip to content
				</a>
				<CartCountBoundary>
					<Header />
					<Promo />
					<main id="main-content" className="flex-1">
						{children}
					</main>
					{modal}
					<Footer />
				</CartCountBoundary>
			</body>
		</html>
	)
}
