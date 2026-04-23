import { defineConfig } from '@playwright/test'
import path from 'node:path'

const PORT = Number(process.env.PORT ?? 3000)
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`

/**
 * API config — drives `request.*` calls (no browser). Shares the same
 * baseURL/webServer convention as the e2e config so `pnpm test` is one
 * coherent suite.
 */
export default defineConfig({
	testDir: path.join(__dirname, './api/'),
	timeout: 30_000,
	expect: { timeout: 5_000 },
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: BASE_URL,
		trace: 'on-first-retry',
	},
	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: 'pnpm dev',
				url: BASE_URL,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
})
