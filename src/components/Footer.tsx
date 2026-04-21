const currentYear = new Date().getFullYear()

export function Footer() {
	return (
		<footer className="text-center bg-black text-white">
			<p>&copy; {currentYear} Swag Store</p>
		</footer>
	)
}
