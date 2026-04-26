import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Hero } from '@/components/Hero'
import { HomeJsonLd } from '@/components/HomeJsonLd'
import { Featured } from '@/components/product/Featured'
import { FeaturedSkeleton } from '@/components/product/FeaturedSkeleton'

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
		images: ['/opengraph-image'],
	},
}

export default function Home() {
	return (
		<>
			<Suspense fallback={null}>
				<HomeJsonLd />
			</Suspense>
			<Hero
				heading="Wear the framework you ship with."
				subheading="Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love."
				buttonText="Browse all Products"
				buttonLink="/search"
			/>
			<Suspense fallback={<FeaturedSkeleton />}>
				<Featured />
			</Suspense>
		</>
	)
}
