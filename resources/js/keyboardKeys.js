export const keyboardKeys = {
	'0': {type: 'math', display: '0'},
	'1': {type: 'math', display: '1'},
	'2': {type: 'math', display: '2'},
	'3': {type: 'math', display: '3'},
	'4': {type: 'math', display: '4'},
	'5': {type: 'math', display: '5'},
	'6': {type: 'math', display: '6'},
	'7': {type: 'math', display: '7'},
	'8': {type: 'math', display: '8'},
	'9': {type: 'math', display: '9'},
	'+': {type: 'math', display: '+'},
	'-': {type: 'math', display: '-'},
	'*': {type: 'math', display: '\\times'},
	'/': {type: 'math', display: '\\div'},
	'x': {type: 'math', display: 'x'},
	'^2': {type: 'math', display: '\\textcolor{lightgray}{x}^2'},
	'^': {type: 'math', display: 'x^y'},
	'sqrt': {type: 'math', display: '\\sqrt{\\phantom{x}}'},
	'y': {type: 'math', display: 'y'},
	'e': {type: 'math', display: '\\ln'},
	'ln': {type: 'math', display: 'e'},
	'(': {type: 'math', display: '('},
	')': {type: 'math', display: ')'},
	'reset': {type: 'icon', display: 'bi bi-trash', fn: (value)=>''},
	'back': {type: 'icon', display: 'bi bi-backspace', fn: (value)=>value.length>0?value.slice(0, -1):''}
}

export const keyboards = {
	'simple': {
		grid: 'grid-cols-4',
		keys: [
			'1', '2', '3', '+',
			'4', '5', '6', '-',
			'7', '8', '9', '*',
			'back', ['0', 2], '/'
		]
	},
	'algebra': {
		grid: 'grid-cols-6',
		keys: [
			'1', '2', '3', '+', 'x','y',
			'4', '5', '6', '-', '^2','^',
			'7', '8', '9', '*', 'sqrt','ln',
			'reset', 'back', '0', '/', '(', ')'
		]
	}
}