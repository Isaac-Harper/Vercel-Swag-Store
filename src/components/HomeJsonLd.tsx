import { JsonLd } from '@/components/ui/JsonLd'
import { getStoreConfig } from '@/lib/api/store'
import { SITE_URL } from '@/lib/site'

/**
 * Separated from `src/app/page.tsx` so `getStoreConfig` (used only to build
 * the JSON-LD graph) doesn't block Hero / Featured render. JSON-LD is a
 * `<script>` tag — zero visual impact from streaming in late, but crawlers
 * still pick it up once it lands in the HTML.
 */
export async function HomeJsonLd() {
	const config = await getStoreConfig()
	const sameAs = [
		config.socialLinks.twitter,
		config.socialLinks.github,
		config.socialLinks.discord,
	].filter((v): v is string => Boolean(v))

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				name: config.storeName,
				url: SITE_URL,
				potentialAction: {
					'@type': 'SearchAction',
					target: `${SITE_URL}/search?q={search_term_string}`,
					'query-input': 'required name=search_term_string',
				},
			},
			{
				'@type': 'Organization',
				name: config.storeName,
				url: SITE_URL,
				logo: `${SITE_URL}/icon`,
				...(sameAs.length > 0 && { sameAs }),
			},
		],
	}

	return <JsonLd data={jsonLd} />
}
