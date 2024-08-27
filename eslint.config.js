import eslint from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from "typescript-eslint"

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	...pluginVue.configs['flat/strongly-recommended'],
	{
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				project: true,
				tsconfigRootDir: './',
				extraFileExtensions: ['.vue'],
				sourceType: 'module',
				"allowImportExportEverywhere": true,
			},
		},
		rules: {
			"semi": [
				"error",
				"never"
			],
			"no-undef": "off",
			"prefer-const": "off",
			"vue/html-indent": [
				"error",
				"tab"
			],
			"vue/block-order": [
				"error",
				{
					"order": [
						"script",
						"template",
						"style"
					]
				}
			],
			"vue/multi-word-component-names": "off",
			"vue/max-attributes-per-line": ["error", {
				"singleline": {
					"max": 1
				},
				"multiline": {
					"max": 1
				}
			}]
		}
	},
)
