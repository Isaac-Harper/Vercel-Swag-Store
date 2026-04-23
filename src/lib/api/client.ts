/**
 * Base HTTP client for backend API calls.
 *
 * Configure via env:
 *   PRODUCTS_API_URL          — base URL of the backend (e.g. https://example/api)
 *   VERCEL_API_BYPASS_TOKEN   — Vercel deployment-protection bypass secret
 *                               (sent as the `x-vercel-protection-bypass` header)
 */

import { z } from 'zod'
import type { ErrorResponse } from '@/types/api'

const API_URL =
	process.env.PRODUCTS_API_URL ?? 'https://vercel-swag-store-api.vercel.app/api'
const BYPASS_TOKEN = process.env.VERCEL_API_BYPASS_TOKEN

const errorResponseSchema = z.object({
	success: z.boolean(),
	error: z.object({
		code: z.string(),
		message: z.string(),
		details: z.unknown().optional(),
	}),
}) satisfies z.ZodType<ErrorResponse>

export class ApiError extends Error {
	status: number

	body?: ErrorResponse

	constructor(status: number, message: string, body?: ErrorResponse) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.body = body
	}
}

export type FetchOptions = RequestInit & {
	params?: Record<string, string | number | boolean | undefined | null>
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
	// TODO: retry on 5xx with exponential backoff
	// TODO: report errors to telemetry
	const { params, headers, ...init } = options
	// `apiFetch` is server-only — `API_URL` is always absolute, so no base needed.
	const url = new URL(`${API_URL}${path}`)
	if (params) {
		for (const [k, v] of Object.entries(params)) {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
		}
	}

	const res = await fetch(url.toString(), {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(BYPASS_TOKEN ? { 'x-vercel-protection-bypass': BYPASS_TOKEN } : {}),
			...headers,
		},
	})

	if (!res.ok) {
		const text = await res.text().catch(() => '')
		// Try to parse the structured ErrorResponse so callers can branch on
		// `error.code` / surface `error.message`. Falls through to a plain
		// ApiError when the body isn't JSON or doesn't match the contract.
		let body: ErrorResponse | undefined
		try {
			body = errorResponseSchema.parse(JSON.parse(text))
		} catch {
			body = undefined
		}
		const summary = body?.error.message ?? text
		throw new ApiError(
			res.status,
			`${init.method ?? 'GET'} ${path} → ${res.status} ${summary}`,
			body,
		)
	}

	if (res.status === 204) return undefined as T
	return res.json() as Promise<T>
}
