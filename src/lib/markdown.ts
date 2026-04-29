import { formatPrice } from '@/lib/format'
import type { Product } from '@/types/product'

/**
 * SAFETY: this module emits markdown for AI agent consumption (the `/md/...`
 * route handlers). Product fields are interpolated unescaped, so a name like
 * `[click](javascript:…)` survives intact. Do **not** render this output in a
 * browser-side markdown viewer (e.g. `<ReactMarkdown>`) without sanitizing
 * first — the agent surface is the only intended consumer.
 */

/**
 * Wraps a markdown body in a `Response` with the headers agent crawlers
 * expect: `Content-Type: text/markdown` and a rough `X-Markdown-Tokens`
 * count (chars/4 — close enough to GPT/Claude tokenization for budgeting).
 */
export function markdownResponse(body: string): Response {
	return new Response(body, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'X-Markdown-Tokens': String(Math.ceil(body.length / 4)),
			// Browsers won't ever hit these — but if a CDN does, vary on Accept
			// so it doesn't serve markdown to a subsequent HTML request.
			Vary: 'Accept',
		},
	})
}

function stockLabel(stock: number): string {
	if (stock === 0) return 'Out of stock'
	if (stock <= 5) return `Only ${stock} left`
	return 'In stock'
}

/** Renders a single product as a compact catalog entry. */
export function productLineMarkdown(product: Product, siteUrl: string): string {
	return `- [${product.name}](${siteUrl}/products/${product.slug}) — ${formatPrice(product.price)}`
}

/** Renders a product's full detail page as markdown. */
export function productDetailMarkdown(
	product: Product,
	siteUrl: string,
	stock: number | null
): string {
	const lines: string[] = [
		`# ${product.name}`,
		'',
		`**Category:** ${product.category}  `,
		`**Price:** ${formatPrice(product.price)}  `,
	]
	if (stock !== null) {
		lines.push(`**Stock:** ${stockLabel(stock)}  `)
	}
	lines.push('', product.description, '')
	if (product.images.length > 0) {
		lines.push('## Images', '')
		for (const src of product.images) {
			const url = src.startsWith('http') ? src : `${siteUrl}${src}`
			lines.push(`- ${url}`)
		}
		lines.push('')
	}
	lines.push('---', '', `HTML version: ${siteUrl}/products/${product.slug}`)
	return lines.join('\n')
}
