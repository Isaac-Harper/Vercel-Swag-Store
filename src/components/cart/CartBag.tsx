export function CartBag({ itemCount = 0 }: { itemCount?: number }) {
	return (
		<span className="relative inline-flex">
			<svg
				aria-hidden="true"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M3 7h18l-1.5 11a2 2 0 01-2 1.5H6.5a2 2 0 01-2-1.5L3 7z" />
				<path d="M8 7V5a4 4 0 018 0v2" />
			</svg>
			{itemCount > 0 && (
				<span className="absolute -bottom-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white transition-transform duration-200 ease-in-out group-hover:scale-125">
					{itemCount}
				</span>
			)}
		</span>
	)
}
