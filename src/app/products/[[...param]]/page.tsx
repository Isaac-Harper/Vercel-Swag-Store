import { notFound, redirect } from 'next/navigation'
import { AddToCartForm } from '@/components/AddToCartForm'
import { getProductBySlug } from '@/data/products'

export default async function ProductsPage({
	params,
}: {
	params: Promise<{ param?: string[] }>
}) {
	const { param } = await params

	if (!param || param.length === 0) redirect('/search')

	if (param.length > 1) notFound()

	const product = getProductBySlug(param[0])
	if (!product) notFound()

	return (
		<section className="px-4 py-16">
			<div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
				<div className="relative w-full pb-[100%]">
					<div
						style={{ backgroundColor: product.color }}
						className="absolute inset-0 rounded"
					/>
				</div>
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold">{product.name}</h1>
					<p className="text-2xl">${product.price}</p>
					<AddToCartForm slug={product.slug} />
				</div>
			</div>
		</section>
	)
}
