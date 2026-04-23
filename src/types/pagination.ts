/**
 * Pagination envelope returned alongside paged list responses.
 * `page` is 1-indexed; `limit` is the requested page size.
 */
export type PaginationMeta = {
	page: number
	limit: number
	total: number
	totalPages: number
	hasNextPage: boolean
	hasPreviousPage: boolean
}
