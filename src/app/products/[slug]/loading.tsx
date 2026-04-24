/**
 * Instant skeleton shown at the route boundary while the product page's
 * `getProduct` fetch is in flight. Mirrors the real layout in
 * `page.tsx` so the swap to the loaded page is a near-zero-shift.
 */
export default function ProductDetailLoading() {
	return (
		<section className="px-4 py-16">
			<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
				<div className="relative w-full animate-pulse rounded bg-gray-200 pb-[100%]" />
				<div className="flex flex-col gap-4">
					<div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
					<div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />
					<div className="h-7 w-24 animate-pulse rounded bg-gray-200" />
					<div className="flex flex-col gap-2">
						<div className="h-4 w-full animate-pulse rounded bg-gray-200" />
						<div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
						<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
					</div>
					<div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
					<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
						<div className="h-14 w-20 animate-pulse rounded bg-gray-200" />
						<div className="h-11 w-full animate-pulse rounded bg-gray-200 sm:w-32" />
					</div>
				</div>
			</div>
		</section>
	)
}
