export interface FormElementExpose {
	focus: () => void
	validate: () => string[]
}

export interface FormElementEmits {
	update: [value: unknown],
	enter: [value: unknown],
	focus: [],
	blur: [],
	errors: [e: string[]],
	button: []
}

export type TextInputType =
	'text' | 'id' | 'email' | 'password' | 'number' | 'color' | 'range' | 'date' | 'datetime-local'

export type FormJsonFieldType =
	TextInputType | 'textarea' | 'select' | 'switch' | 'codearea' | 'fraction' | 'vector' | 'keyboard' | 'numberset'

export type FormComponentType =
	FormJsonFieldType | 'search' | 'json' | 'theme' | 'chapter' | 'team' | 'deck'

export interface FormMakerBaseProps {
	label?: string
	icon?: boolean | string
	prepend?: boolean | string
	inlineLabel?: boolean
	btn?: boolean | string
	clearable?: boolean
	disabled?: boolean
	message?: string
	messageClass?: string
	xs?: boolean
	sm?: boolean
	xl?: boolean
	focus?: boolean
	output?: boolean | string
	inputClass?: false | string
}
