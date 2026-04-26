import { getActivePromo } from '@/lib/api/promo'

export async function Promo() {
	const promo = await getActivePromo()
	if (!promo?.active) return null

	return (
		<aside aria-label="Promotion" className="w-full bg-black py-2">
			<p className="text-center text-sm text-white">
				<span className="font-semibold">{promo.title}</span> — {promo.description}{' '}
				<span>Code: {promo.code}</span>
			</p>
		</aside>
	)
}
