import 'server-only'

import { cookies } from 'next/headers'

const TOKEN_COOKIE = 'cart-token'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getCartToken(): Promise<string | null> {
	const store = await cookies()
	return store.get(TOKEN_COOKIE)?.value ?? null
}

export async function setCartToken(token: string) {
	const store = await cookies()
	store.set(TOKEN_COOKIE, token, {
		path: '/',
		maxAge: MAX_AGE,
		sameSite: 'lax',
		httpOnly: true,
	})
}

export async function clearCartToken() {
	const store = await cookies()
	store.delete(TOKEN_COOKIE)
}
