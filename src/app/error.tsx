'use client'

export default function Error({
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	return (
		<section className="flex flex-col items-center justify-center gap-12 h-screen">
			<h1 className="text-3xl">Something went wrong</h1>
			<button
				type="button"
				onClick={reset}
				className="text-black underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4 hover:opacity-70 transition-opacity font-medium"
			>
				Try again
			</button>
		</section>
	)
}
