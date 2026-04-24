'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import {
	use,
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type FormEvent,
} from 'react'
import { useSearchNav } from '@/components/search/SearchNavProvider'
import type { Category } from '@/types/category'

const DEBOUNCE_MS = 300
const AUTO_SEARCH_MIN_CHARS = 3

export function SearchForm({
	categoriesPromise,
}: {
	categoriesPromise: Promise<Category[]>
}) {
	// Suspends the form until the categories list arrives. The parent wraps
	// `<SearchForm>` in a `<Suspense fallback={<SearchFormSkeleton />}>`, so
	// this `use()` makes that fallback actually show (previously the page
	// awaited categories server-side, so the fallback was unreachable).
	const categories = use(categoriesPromise)
	const pathname = usePathname()
	const params = useSearchParams()
	const { startNav, isPending } = useSearchNav()
	const [q, setQ] = useState(params.get('q') ?? '')
	const [category, setCategory] = useState(params.get('category') ?? '')
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		},
		[],
	)

	// Clones the current URL params and mutates only `q` / `category`, so
	// unrelated filters added later (e.g. `sort`) survive the navigation.
	// Always drops `page` — changing query or category invalidates the page
	// number (we'd land on a `?page=4` that doesn't exist for the new filter).
	function buildUrl(nextQ: string, nextCategory: string) {
		const next = new URLSearchParams(params.toString())
		if (nextQ) next.set('q', nextQ)
		else next.delete('q')
		if (nextCategory) next.set('category', nextCategory)
		else next.delete('category')
		next.delete('page')
		const qs = next.toString()
		return qs ? `${pathname}?${qs}` : pathname
	}

	function pushQuery(nextQ: string, nextCategory: string) {
		startNav(buildUrl(nextQ, nextCategory))
	}

	function handleQChange({ target: { value } }: ChangeEvent<HTMLInputElement>) {
		setQ(value)
		if (debounceRef.current) clearTimeout(debounceRef.current)
		if (value.length === 0 || value.length >= AUTO_SEARCH_MIN_CHARS) {
			debounceRef.current = setTimeout(() => pushQuery(value, category), DEBOUNCE_MS)
		}
	}

	function handleCategoryChange({
		target: { value },
	}: ChangeEvent<HTMLSelectElement>) {
		setCategory(value)
		pushQuery(q, value)
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		if (debounceRef.current) clearTimeout(debounceRef.current)
		pushQuery(q, category)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
		>
			<input
				type="search"
				name="q"
				value={q}
				onChange={handleQChange}
				placeholder="Search products..."
				className="form-input flex-1"
			/>
			<select
				name="category"
				aria-label="Category"
				value={category}
				onChange={handleCategoryChange}
				className="form-input bg-white sm:w-48"
			>
				<option value="">All categories</option>
				{categories.map((c) => (
					<option key={c.slug} value={c.slug}>
						{c.name}
					</option>
				))}
			</select>
			<button
				type="submit"
				disabled={isPending}
				className="cursor-pointer rounded bg-black px-6 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isPending ? 'Searching…' : 'Search'}
			</button>
		</form>
	)
}
