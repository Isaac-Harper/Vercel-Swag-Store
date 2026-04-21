import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Card } from '@/components/Card'
import { SearchForm } from '@/components/SearchForm'
import { products, type Category } from '@/data/products'

const MAX_RESULTS = 5
const MOCK_DELAY_MS = 400

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

export default function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string }>
}) {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<h1 className="mb-8 text-2xl sm:text-3xl font-bold">Search</h1>
				<Suspense fallback={<FormPlaceholder />}>
					<SearchForm />
				</Suspense>
				<Suspense fallback={<SearchPlaceholder />}>
					<SearchResults searchParams={searchParams} />
				</Suspense>
			</div>
		</section>
	)
}

function FormPlaceholder() {
	return (
		<div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
			<div className="h-10 flex-1 animate-pulse rounded bg-gray-100" />
			<div className="h-10 sm:w-48 animate-pulse rounded bg-gray-100" />
			<div className="h-10 w-24 animate-pulse rounded bg-gray-100" />
		</div>
	)
}

function SearchPlaceholder() {
	return (
		<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
			{Array.from({ length: MAX_RESULTS }).map((_, i) => (
				<li key={i} className="flex flex-col gap-3">
					<div className="relative w-full pb-[100%]">
						<div className="absolute inset-0 animate-pulse rounded bg-gray-200" />
					</div>
					<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
				</li>
			))}
		</ul>
	)
}

async function SearchResults({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; category?: string }>
}) {
	const { q = '', category = '' } = await searchParams
	await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))

	const query = q.trim().toLowerCase()
	const categoryFilter = category as Category | ''

	const filtered = products.filter((p) => {
		const matchesQuery = query ? p.name.toLowerCase().includes(query) : true
		const matchesCategory = categoryFilter ? p.category === categoryFilter : true
		return matchesQuery && matchesCategory
	})
	const results = filtered.slice(0, MAX_RESULTS)

	if (results.length === 0) {
		return (
			<p className="text-gray-600">
				No products match {q ? `"${q}"` : 'your filters'}.
			</p>
		)
	}

	return (
		<>
			<ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
				{results.map((product) => (
					<Card key={product.slug} {...product} />
				))}
			</ul>
			{filtered.length > MAX_RESULTS && (
				<p className="mt-4 text-xs text-gray-500">
					Showing {MAX_RESULTS} of {filtered.length} results.
				</p>
			)}
		</>
	)
}
