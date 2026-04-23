/**
 * Shared placeholder used in both states:
 * - As `<Image src>` when a product has no image at all
 * - As `<Image blurDataURL>` for the loading state of every Image
 *
 * Same visual in both contexts so loading and missing-image read as one
 * consistent "Vercel Swag" placeholder. The static file at
 * `public/product-placeholder.svg` and the base64 data URL below must stay in
 * sync — if the SVG changes, regenerate the base64.
 */
export const PRODUCT_PLACEHOLDER_SRC = '/product-placeholder.svg'

export const PRODUCT_PLACEHOLDER_BLUR =
	'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjxwYXRoIGQ9Ik01MCAzMiBMNzQgNzIgTDI2IDcyIFoiIGZpbGw9IiM5Y2EzYWYiLz48L3N2Zz4='
