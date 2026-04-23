'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
	useEffect,
	useRef,
	useState,
	useTransition,
	type ChangeEvent,
	type FormEvent,
} from 'react'
import type { Category } from '@/types/category'

const DEBOUNCE_MS = 300
const AUTO_SEARCH_MIN_CHARS = 3

export function SearchForm({ categories }: { categories: Category[] }) {
	const router = useRouter()
	const params = useSearchParams()
	const [q, setQ] = useState(params.get('q') ?? '')
	const [category, setCategory] = useState(params.get('category') ?? '')
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [pending, startTransition] = useTransition()

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		},
		[],
	)

	function buildUrl(nextQ: string, nextCategory: string) {
		const next = new URLSearchParams()
		if (nextQ) next.set('q', nextQ)
		if (nextCategory) next.set('category', nextCategory)
		const qs = next.toString()
		return qs ? `/search?${qs}` : '/search'
	}

	function pushQuery(nextQ: string, nextCategory: string) {
		startTransition(() => {
			router.push(buildUrl(nextQ, nextCategory))
		})
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
				disabled={pending}
				className="cursor-pointer rounded bg-black px-6 py-2 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{pending ? 'Searching…' : 'Search'}
			</button>
		</form>
	)
}
