import type { Metadata } from 'next'
import { Featured } from '@/components/Featured'
import { Hero } from '@/components/Hero'
import { JsonLd } from '@/components/JsonLd'

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

const websiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: 'Vercel Swag Store',
	url: SITE_URL,
	potentialAction: {
		'@type': 'SearchAction',
		target: `${SITE_URL}/search?q={search_term_string}`,
		'query-input': 'required name=search_term_string',
	},
}

export default function Home() {
	return (
		<>
			<JsonLd data={websiteJsonLd} />
			<Hero
				heading="Wear the framework you ship with."
				subheading="Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love."
				buttonText="Browse all Products"
				buttonLink="/products"
			/>
			<Featured />
		</>
	)
}
