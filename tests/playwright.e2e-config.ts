import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'

const PORT = Number(process.env.PORT ?? 3000)
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`

/**
 * E2E config — drives a real browser against the running app. By default
 * boots `next dev` for the test run; set `PLAYWRIGHT_BASE_URL` to point at a
 * deployed preview/production URL instead (`webServer` is skipped in that case).
 */
export default defineConfig({
	testDir: path.join(__dirname, './e2e/'),
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
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
		{ name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
	],
	// Skip the auto-spawn when running against a remote URL.
	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: 'pnpm dev',
				url: BASE_URL,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
			},
})
