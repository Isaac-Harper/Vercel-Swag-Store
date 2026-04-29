import type { Route } from 'next'
import Link from 'next/link'

type HeroProps = {
	heading: string
	subheading: string
	buttonText: string
	buttonLink: Route
}

export function Hero({ heading, subheading, buttonText, buttonLink }: HeroProps) {
	return (
		<section className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
			<svg aria-hidden="true" viewBox="0 0 75 65" className="mb-4 h-20 w-auto sm:h-28 lg:h-36">
				<path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor" />
			</svg>
			<h1 className="text-4xl font-bold">{heading}</h1>
			<p className="text-lg">{subheading}</p>
			<Link
				href={buttonLink}
				className="mt-2 cursor-pointer rounded bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-80 active:opacity-60"
			>
				{buttonText}
			</Link>
		</section>
	)
}
