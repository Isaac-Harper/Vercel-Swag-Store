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
	const mdQ = explicitQ(accept, 'text/markdown')
	if (mdQ === 0) return NextResponse.next()
	const htmlQ = explicitQ(accept, 'text/html')
	// Strict-majority: markdown only wins when its q is greater than html's.
	// Browsers always send `text/html;q=1`, so they never get rewritten unless
	// they bid markdown higher — which they don't.
	if (mdQ <= htmlQ) return NextResponse.next()

	const url = request.nextUrl.clone()
	url.pathname = url.pathname === '/' ? '/md' : `/md${url.pathname}`
	return NextResponse.rewrite(url)
}

/**
 * Highest q-value at which `type` appears literally in the Accept header
 * (RFC 9110 §12.5.1). Wildcards (`text/*`, `*\/*`) are intentionally ignored
 * — markdown switching only kicks in on an explicit opt-in, so `*\/*;q=0.8`
 * from a browser doesn't accidentally trigger it.
 */
function explicitQ(accept: string, type: string): number {
	let best = 0
	for (const segment of accept.split(',')) {
		const parts = segment.trim().split(';')
		if (parts[0]?.trim().toLowerCase() !== type) continue
		let q = 1
		for (let i = 1; i < parts.length; i++) {
			const param = parts[i].trim()
			if (!param.startsWith('q=')) continue
			const parsed = Number.parseFloat(param.slice(2))
			if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) q = parsed
			break
		}
		if (q > best) best = q
	}
	return best
}

export const config = {
	matcher: ['/', '/search', '/products/:slug'],
}
