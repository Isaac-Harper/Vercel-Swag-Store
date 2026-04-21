import { cookies } from 'next/headers'
import { products, type Product } from '@/data/products'

const COOKIE_NAME = 'cart'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export type CartLine = {
	slug: string
	quantity: number
}

export type CartItem = {
	product: Product
	quantity: number
}

async function readLines(): Promise<CartLine[]> {
	const store = await cookies()
	const raw = store.get(COOKIE_NAME)?.value
	if (!raw) return []
	try {
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

async function writeLines(lines: CartLine[]) {
	const store = await cookies()
	store.set(COOKIE_NAME, JSON.stringify(lines), {
		path: '/',
		maxAge: MAX_AGE,
		sameSite: 'lax',
	})
}

export async function getCartItems(): Promise<CartItem[]> {
	const lines = await readLines()
	return lines
		.map((line) => {
			const product = products.find((p) => p.slug === line.slug)
			return product ? { product, quantity: line.quantity } : null
		})
		.filter((x): x is CartItem => x !== null)
}

export async function getCartCount(): Promise<number> {
	const lines = await readLines()
	return lines.reduce((sum, l) => sum + l.quantity, 0)
}

export async function addLine(slug: string, quantity = 1) {
	const product = products.find((p) => p.slug === slug)
	if (!product) return
	const lines = await readLines()
	const existing = lines.find((l) => l.slug === slug)
	const desired = (existing?.quantity ?? 0) + quantity
	const clamped = Math.min(desired, product.stock)
	if (clamped <= 0) return
	if (existing) {
		existing.quantity = clamped
	} else {
		lines.push({ slug, quantity: clamped })
	}
	await writeLines(lines)
}

export async function setLineQuantity(slug: string, quantity: number) {
	const product = products.find((p) => p.slug === slug)
	if (!product) return
	const clamped = Math.max(0, Math.min(quantity, product.stock))
	const lines = await readLines()
	if (clamped <= 0) {
		await writeLines(lines.filter((l) => l.slug !== slug))
		return
	}
	const existing = lines.find((l) => l.slug === slug)
	if (existing) {
		existing.quantity = clamped
		await writeLines(lines)
	}
}

export async function removeLine(slug: string) {
	const lines = await readLines()
	await writeLines(lines.filter((l) => l.slug !== slug))
}

export async function clearCart() {
	const store = await cookies()
	store.delete(COOKIE_NAME)
}
