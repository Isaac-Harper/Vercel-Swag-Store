import Link from 'next/link'
import { z } from 'zod'

const heroSchema = z.object({
	bgColor: z.string(),
	textColor: z.string(),
	heading: z.string(),
	subheading: z.string(),
	buttonText: z.string(),
	buttonColor: z.string(),
	buttonTextColor: z.string(),
	buttonLink: z.string().default('/'),
})

type HeroProps = z.input<typeof heroSchema>

export function Hero(props: HeroProps) {
	const {
		bgColor,
		textColor,
		heading,
		subheading,
		buttonText,
		buttonColor,
		buttonTextColor,
		buttonLink,
	} = heroSchema.parse(props)

	return (
		<section
			style={{ backgroundColor: bgColor, color: textColor }}
			className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center"
		>
			<h1 className="text-4xl font-bold">{heading}</h1>
			<p className="text-lg  ">{subheading}</p>
			<Link
				href={buttonLink}
				style={{ backgroundColor: buttonColor, color: buttonTextColor }}
				className="mt-2 rounded px-6 py-3 text-sm font-medium"
			>
				{buttonText}
			</Link>
		</section>
	)
}
