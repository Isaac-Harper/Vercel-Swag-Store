import Monogram from '../components/svg/monogram'

export default function Home() {
	return (
		<main className="text-lg flex flex-col items-center justify-center gap-8 min-h-dvh">
			<Monogram className="w-9" />
			<p>Make it count.</p>
		</main>
	)
}
