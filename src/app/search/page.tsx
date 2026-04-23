import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchForm } from '@/components/search/SearchForm'
import { SearchFormSkeleton } from '@/components/search/SearchFormSkeleton'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeleton'
import { listCategories } from '@/lib/api/categories'

export const metadata: Metadata = {
	title: 'Search',
	description: 'Browse all Vercel swag products.',
	alternates: { canonical: '/search' },
	openGraph: {
		title: 'Search',
		description: 'Browse all Vercel swag products.',
		url: '/search',
	},
}

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string }>
}) {
	const categories = await listCategories()

	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<h1 className="mb-8 text-2xl sm:text-3xl font-bold">Search</h1>
				<Suspense fallback={<SearchFormSkeleton />}>
					<SearchForm categories={categories} />
				</Suspense>
				<Suspense fallback={<SearchResultsSkeleton />}>
					<SearchResults searchParams={searchParams} />
				</Suspense>
			</div>
		</section>
	)
}
