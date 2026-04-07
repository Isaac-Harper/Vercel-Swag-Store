/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Home from '../../src/app/page'

describe('RichText', () => {
	it('renders', async () => {
		render(<Home />)
		expect(screen.getByRole('main')).toBeDefined()
	})
})
