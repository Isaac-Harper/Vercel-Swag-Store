import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Page not found',
}

export default function NotFound() {
	return (
		<main className="flex flex-col items-center justify-center gap-12 h-screen">
			<h1 className="text-3xl">Page not found</h1>
			<Link href="/" className="text-accent hover:opacity-70 transition-opacity font-medium">
				Back home
			</Link>
		</main>
	)
}
