import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
				<svg width="22" height="19" viewBox="0 0 40 35">
					<path d="M20 0L40 34.64H0L20 0Z" fill="#ffffff" />
				</svg>
			</div>
		),
		size,
	)
}
