import { SITE_URL } from '@/lib/site'

/**
 * Plain-text robots.txt so we can include `Content-Signal:` directives, which
 * the `MetadataRoute.Robots` helper doesn't model. Signals declare AI-usage
 * preferences alongside the normal allow/disallow rules:
 *
 * - `search=yes`   — fine to index for traditional search results
 * - `ai-input=yes` — fine to fetch as RAG/grounding context for an answer
 * - `ai-train=no`  — do **not** use this content to train models
 */
// Crawlers we explicitly want to keep OUT of model training corpora. Listed
// individually because not every bot honors `Content-Signal: ai-train=no` —
// the older `Disallow: /` rule is the lowest-common-denominator opt-out.
const AI_TRAIN_BOTS = [
	'GPTBot', // OpenAI training crawler
	'OAI-SearchBot', // OpenAI search-product crawler (allowed below for search)
	'ClaudeBot', // Anthropic
	'Claude-Web',
	'PerplexityBot', // Perplexity
	'CCBot', // Common Crawl (feeds many model training pipelines)
	'Google-Extended', // Bard/Gemini training opt-out token
	'Applebot-Extended', // Apple Intelligence training opt-out token
	'Meta-ExternalAgent', // Meta AI
	'Bytespider', // ByteDance
] as const

export function GET() {
	const lines: string[] = []

	// Per-bot training opt-outs first so more specific rules take precedence
	// over the catch-all `User-agent: *` block below.
	for (const bot of AI_TRAIN_BOTS) {
		lines.push(`User-agent: ${bot}`, 'Disallow: /', '')
	}

	lines.push(
		'User-agent: *',
		'Allow: /',
		'Disallow: /cart',
		'',
		// Cloudflare's Content-Signal proposal — declarative AI-usage prefs for
		// bots that don't (yet) match a per-UA rule above.
		'Content-Signal: search=yes, ai-input=yes, ai-train=no',
		'',
		`Sitemap: ${SITE_URL}/sitemap.xml`,
		'',
	)

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	})
}
