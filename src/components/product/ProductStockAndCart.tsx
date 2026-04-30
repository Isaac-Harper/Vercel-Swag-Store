import { AddToCartForm } from '@/components/cart/AddToCartForm'
import { getCart } from '@/lib/api/cart'
import { getProductStock } from '@/lib/api/products'

const LOW_STOCK_THRESHOLD = 5

function getStockMessage(stock: number, available: number, inCart: number): string {
	if (stock === 0) return 'Out of stock'
	if (available === 0) return inCart === stock ? 'Maximum in cart' : 'Out of stock'
	if (available <= LOW_STOCK_THRESHOLD) return `Only ${available} left in stock`
	return 'In stock'
}

export async function ProductStockAndCart({ id, slug }: { id: string; slug: string }) {
	// Detail page spec requires real-time stock, so bypass the hour-cached
	// variant used by listings. We also subtract whatever the user already has
	// in the cart so the displayed "left" count and the form's stock cap track
	// what the user can *still add* — without this, repeated Add-to-cart clicks
	// happily exceed real inventory until checkout finally rejects them.
	// `getCart` is cache-tagged and busted by `addToCart`, so this re-renders
	// (via Next.js's action-driven router refresh) with a fresh subtraction
	// after every successful add.
	const [stockInfo, cartItems] = await Promise.all([getProductStock(id), getCart()])
	const stock = stockInfo?.stock ?? 0
	const inCart = cartItems.find((item) => item.id === id)?.quantity ?? 0
	const available = Math.max(0, stock - inCart)
	const message = getStockMessage(stock, available, inCart)

	return (
		<>
			<p className={`text-sm ${available === 0 ? 'text-red-600' : 'text-gray-600'}`}>{message}</p>
			<AddToCartForm slug={slug} stock={available} />
		</>
	)
}
