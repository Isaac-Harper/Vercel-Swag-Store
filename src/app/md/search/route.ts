import { PAGE_SIZE } from '@/components/search/SearchResultsList'
import { markdownResponse, productLineMarkdown } from '@/lib/markdown'
import { listProductsPaginated } from '@/lib/api/products'
import { SITE_URL } from '@/lib/site'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const q = searchParams.get('q') ?? ''
	const category = searchParams.get('category') ?? ''
	const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

	const { data, pagination } = await listProductsPaginated({
		q: q.trim() || undefined,
		category: category || undefined,
		limit: PAGE_SIZE,
		page,
	})

	const filterDesc = [q && `query "${q}"`, category && `category "${category}"`]
		.filter(Boolean)
		.join(', ')

	const lines: string[] = [
		`# Search${filterDesc ? ` — ${filterDesc}` : ''}`,
		'',
		`Showing ${data.length} of ${pagination.total} results (page ${pagination.page} of ${pagination.totalPages}).`,
		'',
	]

	if (data.length === 0) {
		lines.push('_No products match your filters._')
	} else {
		lines.push(...data.map((p) => productLineMarkdown(p, SITE_URL)))
	}

	if (pagination.totalPages > 1) {
		lines.push('', '## Pages', '')
		const baseQs = new URLSearchParams()
		if (q) baseQs.set('q', q)
		if (category) baseQs.set('category', category)
		for (let p = 1; p <= pagination.totalPages; p++) {
			const qs = new URLSearchParams(baseQs)
			if (p > 1) qs.set('page', String(p))
			const suffix = qs.toString()
			lines.push(
				`- Page ${p}: ${SITE_URL}/search${suffix ? `?${suffix}` : ''}${p === pagination.page ? ' (current)' : ''}`
			)
		}
	}

	return markdownResponse(lines.join('\n'))
}
