/**
 * Branded number for amounts in the smallest currency unit (cents for USD).
 * Prevents raw `number` from being passed where cents are expected — in
 * particular, stops dollars-as-cents bugs at `formatPrice` and totals math.
 */
export type Cents = number & { readonly __brand: 'Cents' }

/** Brand a raw number as `Cents`. Use only at trust boundaries (Zod parse,
 * mock data, arithmetic results) — call sites that already hold `Cents`
 * should pass it through unchanged. */
export function cents(n: number): Cents {
	return n as Cents
}
