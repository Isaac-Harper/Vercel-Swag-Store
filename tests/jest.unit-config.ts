import type { Config } from 'jest'

const config: Config = {
	testMatch: ['**/*.test.ts', '**/*.test.tsx'],
	verbose: true,
	rootDir: '.',
	testEnvironment: 'jest-environment-jsdom',
	transform: {
		'^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/../src/$1',
		'^@tests(.*)$': '<rootDir>/$1',
	},
}

export default config
