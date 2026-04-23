import Link from 'next/link'
import { z } from 'zod'
import { LinkPending } from '@/components/ui/LinkPending'

const heroSchema = z.object({
	heading: z.string(),
	subheading: z.string(),
	buttonText: z.string(),
	buttonLink: z.string().default('/'),
})

type HeroProps = z.input<typeof heroSchema>

export function Hero(props: HeroProps) {
	const { heading, subheading, buttonText, buttonLink } = heroSchema.parse(props)

	return (
		<section className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
			<h1 className="text-4xl font-bold">{heading}</h1>
			<p className="text-lg">{subheading}</p>
			<Link
				href={buttonLink}
				className="relative mt-2 cursor-pointer rounded bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60"
			>
				{buttonText}
				<LinkPending />
			</Link>
		</section>
	)
}
