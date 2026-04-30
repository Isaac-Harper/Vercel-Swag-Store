import { AddToCartForm } from '@/components/cart/AddToCartForm'
import { getCart } from '@/lib/api/cart'
import { getProductStock } from '@/lib/api/products'

export async function ProductStockAndCart({ id, slug }: { id: string; slug: string }) {
	// Detail page spec requires real-time stock, so bypass the hour-cached
	// variant used by listings. We also subtract whatever the user already has
	// in the cart so the form's stock cap reflects what they can *still add* —
	// without this, repeated Add-to-cart clicks happily exceed real inventory
	// until checkout finally rejects them.
	//
	// `available` is the server-truth baseline; `<AddToCartForm>` layers a
	// client-side optimistic decrement on top so the displayed count drops the
	// instant the user clicks Add (without the action round-trip). `getCart`
	// is cache-tagged and busted by `addToCart`, so this server component
	// re-renders with a fresh `available` after every successful add and the
	// client's optimistic delta resets onto that new baseline.
	const [stockInfo, cartItems] = await Promise.all([getProductStock(id), getCart()])
	const stock = stockInfo?.stock ?? 0
	const inCart = cartItems.find((item) => item.id === id)?.quantity ?? 0
	const available = Math.max(0, stock - inCart)

	return <AddToCartForm slug={slug} stock={stock} available={available} />
}
