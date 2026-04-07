import { NextResponse } from 'next/server'
import { generateNonce } from './lib/utils/nonce-util'
import { SECURITY_HEADERS, generateCSP } from './config/headers'

export function proxy() {
	const response = NextResponse.next()
	const nonce = generateNonce()

	response.headers.set('Content-Security-Policy', generateCSP(nonce))
	Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
		response.headers.set(key, value)
	})

	return response
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public/).*)'],
}
