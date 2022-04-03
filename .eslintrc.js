module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"plugin:vue/vue3-recommended",
	],
	"plugins": [
		"vue"
	],
	"globals": {
		"defineProps": true,
		"defineEmits": true
	},
	"rules": {
		"indent": [
			"error", "tab"
		],
		// "linebreak-style": [
		// 	"error", "unix"
		// ],
		"quotes": [
			"error", "double"
		],
		"semi": [
			"error", "never"
		],
		"vue/require-default-prop": "off",
		"vue/html-indent": ["warn", "tab", {"attribute": 1, "closeBracket": 0}],
		"vue/script-indent": ["error", "tab", {"baseIndent": 0}],
		"vue/order-in-components": ["error"],
		"vue/html-quotes": [ "error", "double", { "avoidEscape": false } ]
	},
	"overrides": [
		{
			"files": ["*.vue"],
			"rules": {
				"indent": "off"
			}
		}
	]
}
