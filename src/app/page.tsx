import { Featured } from '@/components/Featured'
import { Hero } from '@/components/Hero'

export default function Home() {
	return (
		<>
			<Hero
				heading="Wear the framework you ship with."
				subheading="Premium swag for developers who build with Vercel. From tees to tech gear, represent the tools you love."
				buttonText="Browse all Products"
				bgColor="#fff"
				buttonColor="#000"
				textColor="#000"
				buttonTextColor="#fff"
			/>
			<Featured />
		</>
	)
}
