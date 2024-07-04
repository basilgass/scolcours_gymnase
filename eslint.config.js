import eslint from '@eslint/js';
import tseslint from "typescript-eslint";
import pluginVue from 'eslint-plugin-vue'


export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	...pluginVue.configs['flat/strongly-recommended'],
	{
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
				project: './tsconfig.json',
				extraFileExtensions: ['.vue'],
				sourceType: 'module',
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
					"max": 3
				},
				"multiline": {
					"max": 1
				}
			}]
		}
	},
)
