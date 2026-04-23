import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Featured } from '@/components/product/Featured'
import { FeaturedSkeleton } from '@/components/product/FeaturedSkeleton'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/ui/JsonLd'
import { getStoreConfig } from '@/lib/api/store'

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vercel-swag-store.vercel.app'

export const metadata: Metadata = {
	title: 'Home',
	description:
		'Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love.',
	alternates: { canonical: '/' },
	openGraph: {
		title: 'Home',
		description:
			'Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love.',
		url: '/',
	},
}

export default async function Home() {
	const config = await getStoreConfig()
	const sameAs = [
		config.socialLinks.twitter,
		config.socialLinks.github,
		config.socialLinks.discord,
	].filter((v): v is string => Boolean(v))

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				name: config.storeName,
				url: SITE_URL,
				potentialAction: {
					'@type': 'SearchAction',
					target: `${SITE_URL}/search?q={search_term_string}`,
					'query-input': 'required name=search_term_string',
				},
			},
			{
				'@type': 'Organization',
				name: config.storeName,
				url: SITE_URL,
				...(sameAs.length > 0 && { sameAs }),
			},
		],
	}

	return (
		<>
			<JsonLd data={jsonLd} />
			<Hero
				heading="Wear the framework you ship with."
				subheading="Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love."
				buttonText="Browse all Products"
				buttonLink="/products"
			/>
			<Suspense fallback={<FeaturedSkeleton />}>
				<Featured />
			</Suspense>
		</>
	)
}
