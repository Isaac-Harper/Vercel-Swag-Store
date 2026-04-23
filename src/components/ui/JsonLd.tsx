export function JsonLd({ data }: { data: Record<string, unknown> }) {
	// dangerouslySetInnerHTML is the standard way to inject schema.org
	// structured data per Next.js / React docs. The data is JSON-stringified
	// from a typed object, not from user input, so it's safe.
	return (
		<script
			type="application/ld+json"
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}
