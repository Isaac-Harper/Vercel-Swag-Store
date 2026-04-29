import { ImageResponse } from 'next/og'

export const alt = 'Search the Vercel Swag Store'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#ffffff',
					gap: 32,
				}}
			>
				<svg width="260" height="225" viewBox="0 0 74 64">
					<path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="#000000" />
				</svg>
				<div style={{ fontSize: 72, fontWeight: 700, color: '#000000' }}>Search</div>
				<div
					style={{
						fontSize: 28,
						color: '#666666',
						maxWidth: 900,
						textAlign: 'center',
					}}
				>
					Browse all Vercel swag products.
				</div>
			</div>
		),
		size
	)
}
