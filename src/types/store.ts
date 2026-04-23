/**
 * Storefront-wide config served from `GET /store/config`. Drives layout
 * metadata, feature toggles, footer links, and SEO defaults.
 *
 * `socialLinks` is open-ended — known platforms (twitter/github/discord) are
 * called out for typeahead, but the API may return arbitrary keys for newly
 * added platforms.
 */
export type StoreFeatures = {
	wishlist: boolean
	productComparison: boolean
	reviews: boolean
	liveChat: boolean
	recentlyViewed: boolean
}

export type StoreSocialLinks = {
	twitter?: string
	github?: string
	discord?: string
} & Record<string, string>

export type StoreSeo = {
	defaultTitle: string
	titleTemplate: string
	defaultDescription: string
}

export type StoreConfig = {
	storeName: string
	currency: string
	features: StoreFeatures
	socialLinks: StoreSocialLinks
	seo: StoreSeo
}
