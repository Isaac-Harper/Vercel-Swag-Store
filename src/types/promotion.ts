/**
 * Active or scheduled promotion as returned by the catalog API.
 * `discountPercent` is whole-number percent (e.g. 15 → 15% off).
 * `validFrom`/`validUntil` are RFC 3339 date-time strings.
 */
export type Promotion = {
	id: string
	title: string
	description: string
	code: string
	discountPercent: number
	validFrom: string
	validUntil: string
	active: boolean
}
