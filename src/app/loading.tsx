import { FeaturedSkeleton } from '@/components/product/FeaturedSkeleton'

export default function HomeLoading() {
	return (
		<>
			<section className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
				<div className="mx-auto h-10 w-2/3 max-w-xl animate-pulse rounded bg-gray-200" />
				<div className="mx-auto h-5 w-3/4 max-w-2xl animate-pulse rounded bg-gray-200" />
				<div className="mt-2 h-11 w-44 animate-pulse rounded bg-gray-200" />
			</section>
			<FeaturedSkeleton />
		</>
	)
}
