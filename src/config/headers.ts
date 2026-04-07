export const SECURITY_HEADERS = {
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
	'X-Frame-Options': 'SAMEORIGIN',
	'X-XSS-Protection': '1; mode=block',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
	'Access-Control-Allow-Origin': '*',
}

export const CSP_SOURCES = {
	script: [
		"'self'",
		"'nonce-__NONCE__'",
		'https://vercel.live',
		'https://rstr.in',
		'https://cdn.raster.app',
	],
	style: ["'self'", "'unsafe-inline'"],
	font: ["'self'", 'data:'],
	img: [
		"'self'",
		'data:',
		'blob:',
		'https://vercel.live',
		'https://rstr.in',
		'https://cdn.raster.app',
	],
	frame: ["'self'", 'https://vercel.live', 'https://rstr.in', 'https://cdn.raster.app'],
	media: ["'self'", 'https://vercel.live', 'https://rstr.in', 'https://cdn.raster.app'],
	worker: ["'self'", 'blob:'],
	connect: [
		"'self'",
		'https://vercel.live',
		'https://rstr.in',
		'https://cdn.raster.app',
		'*.vercel.app',
	],
}

export const generateCSP = (nonce: string) => {
	const isProduction =
		process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview'

	const csp = `
		default-src 'self';
		script-src ${CSP_SOURCES.script.join(' ')};
		style-src ${CSP_SOURCES.style.join(' ')};
		font-src ${CSP_SOURCES.font.join(' ')};
		img-src ${CSP_SOURCES.img.join(' ')};
		frame-src ${CSP_SOURCES.frame.join(' ')};
		media-src ${CSP_SOURCES.media.join(' ')};
		worker-src ${CSP_SOURCES.worker.join(' ')};
		connect-src ${CSP_SOURCES.connect.join(' ')};
		base-uri 'self';
		form-action 'self';
		frame-ancestors 'self';
		object-src 'none';
		${isProduction ? 'upgrade-insecure-requests;' : ''}
	`
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/__NONCE__/g, nonce)
	return csp
}
