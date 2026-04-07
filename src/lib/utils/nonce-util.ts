export const generateNonce = () => {
	const bytes = new Uint8Array(16)
	crypto.getRandomValues(bytes)
	return Buffer.from(bytes).toString('base64')
}
