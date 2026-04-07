module.exports = {
	extends: '@monogram/eslint-config/next',
	rules: {
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: ['**/*.spec.ts', '**/*.test.ts', '**/*.test.tsx', '**/*config.ts'],
			},
		],
	},
}
