import { products, type Product } from '@/data/products'

export type CartItem = {
	product: Product
	quantity: number
}

export const cartItems: CartItem[] = [
	{ product: products[0], quantity: 1 },
	{ product: products[1], quantity: 2 },
]
