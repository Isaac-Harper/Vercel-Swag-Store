import { NextResponse, type NextRequest } from 'next/server'

/**
 * Content negotiation for AI agents: when a request prefers `text/markdown`,
 * rewrite to a parallel `/md/...` route that renders the page as markdown.
 * Browsers don't send `text/markdown`, so they keep getting HTML.
 *
 * The exposed surface (matched in `config.matcher` below) is intentionally
 * narrow — only routes with an explicit markdown handler under `src/app/md/`.
 */
export function proxy(request: NextRequest) {
	const accept = request.headers.get('accept') ?? ''
	if (!accept.includes('text/markdown')) return NextResponse.next()

	const mdIndex = accept.indexOf('text/markdown')
	const htmlIndex = accept.indexOf('text/html')
	if (htmlIndex !== -1 && htmlIndex < mdIndex) return NextResponse.next()

	const url = request.nextUrl.clone()
	url.pathname = url.pathname === '/' ? '/md' : `/md${url.pathname}`
	return NextResponse.rewrite(url)
}

export const config = {
	matcher: ['/', '/search', '/products/:slug'],
}
