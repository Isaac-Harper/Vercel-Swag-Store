import { PaginationSkeleton } from '@/components/search/PaginationSkeleton'
import { SearchFormSkeleton } from '@/components/search/SearchFormSkeleton'
import { SearchResultsSkeleton } from '@/components/search/SearchResultsSkeleton'

export default function SearchLoading() {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto max-w-6xl">
				<h1 className="mb-8 text-2xl sm:text-3xl font-bold">Search</h1>
				<SearchFormSkeleton />
				<SearchResultsSkeleton />
				<PaginationSkeleton />
			</div>
		</section>
	)
}
