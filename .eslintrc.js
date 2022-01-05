module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		// "eslint:recommended",
		'plugin:vue/vue3-recommended',
	],
	// "parserOptions": {
	// 	"ecmaVersion": 13,
	// 	"sourceType": "module"
	// },
	'plugins': [
		'vue'
	],
	'globals': {
		'defineProps': true,
		'defineEmits': true
	},
	'rules': {
		'indent': [
			'error', 'tab'
		],
		'linebreak-style': [
			'error', 'unix'
		],
		'quotes': [
			'error', 'single'
		],
		'semi': [
			'error', 'never'
		],
		'vue/require-default-prop': 'off',
		'vue/html-indent': ['warn', 'tab',{'attribute': 1, 'closeBracket': 0}],
		'vue/script-indent': ['error', 'tab', { 'baseIndent': 0}],
		'vue/order-in-components': ['error']
	},
	'overrides': [
		{
			'files': ['*.vue'],
			'rules': {
				'indent': 'off'
			}
		}
	]
}
