import type { Metadata, Viewport } from 'next'
import { Suspense, type ReactNode } from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { CartBadgeAsync } from '@/components/cart/CartBadgeAsync'
import { CartBag } from '@/components/cart/CartBag'
import { CartCountProvider } from '@/components/cart/CartCountProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Promo } from '@/components/layout/Promo'
import { getStoreConfig } from '@/lib/api/store'
import { SITE_URL } from '@/lib/site'

import './globals.css'

function extractTwitterHandle(url?: string): string | undefined {
	if (!url) return undefined
	const match = url.match(/(?:twitter|x)\.com\/([^/?#]+)/)
	return match ? `@${match[1]}` : undefined
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#000000' },
	],
}

export async function generateMetadata(): Promise<Metadata> {
	const config = await getStoreConfig()
	const twitterHandle = extractTwitterHandle(config.socialLinks.twitter)
	return {
		metadataBase: new URL(SITE_URL),
		title: {
			default: config.seo.defaultTitle,
			template: config.seo.titleTemplate,
		},
		description: config.seo.defaultDescription,
		icons: {
			icon: '/favicon.svg',
		},
		openGraph: {
			type: 'website',
			siteName: config.storeName,
			title: config.seo.defaultTitle,
			description: config.seo.defaultDescription,
			url: '/',
			locale: 'en_US',
		},
		twitter: {
			card: 'summary_large_image',
			site: twitterHandle,
			creator: twitterHandle,
			title: config.seo.defaultTitle,
			description: config.seo.defaultDescription,
		},
		robots: {
			index: true,
			follow: true,
		},
	}
}

export default function RootLayout({
	children,
	modal,
}: {
	children: ReactNode
	modal: ReactNode
}) {
	return (
		<html
			lang="en"
			// `data-scroll-behavior` lets Next.js disable the CSS smooth scroll
			// during route transitions (otherwise back/forward jumps animate).
			data-scroll-behavior="smooth"
			className={`${GeistSans.variable} ${GeistMono.variable}`}
		>
			<body>
				<a
					href="#main-content"
					className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-2 focus-visible:top-2 focus-visible:z-50 focus-visible:rounded focus-visible:bg-black focus-visible:px-4 focus-visible:py-2 focus-visible:text-white"
				>
					Skip to content
				</a>
				<CartCountProvider>
					<Header
						cartBadge={
							<Suspense fallback={<CartBag itemCount={0} />}>
								<CartBadgeAsync />
							</Suspense>
						}
					/>
					<Promo />
					<main id="main-content" className="flex-1">
						{children}
					</main>
					{modal}
					<Footer />
				</CartCountProvider>
			</body>
		</html>
	)
}
