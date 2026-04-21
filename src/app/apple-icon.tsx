import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '100%',
					backgroundColor: '#000000',
				}}
			>
				<svg width="120" height="104" viewBox="0 0 40 35">
					<path d="M20 0L40 34.64H0L20 0Z" fill="#ffffff" />
				</svg>
			</div>
		),
		size,
	)
}
