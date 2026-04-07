import { expect, test } from '@playwright/test'

test.describe('Example for the API endpointd', () => {
	test('should return a 200 status code', async ({ request }) => {
		// here the URL for the Next API endpoint could be 'http://localhost:3000/api/example'
		const response = await request.get('https://jsonplaceholder.typicode.com/todos/1')

		const responseJson = await response.json()

		expect(response.status()).toBe(200)
		expect(responseJson.title).toBe('delectus aut autem')
	})
})
