export interface FormElementExpose {
	focus: () => void
	validate: () => string[]
}

// REFACTOR: FormElementEmits doit exporter des "ModelInterface"
//string | boolean | number | Record<string, string>  | undefined
export interface FormElementEmits {
	update: [value: unknown],
	enter: [value: unknown],
	focus: [],
	blur: [],
	errors: [e: string[]],
	button: []
}

export type FormMakerInputsType =
	"id" |
	"text" |
	"email" |
	"password" |
	"number" |
	"color" |
	"textarea" |
	"select" |
	"checkbox" |
	"code" |
	"keyboard" |
	"switch" |
	"fraction" |
	"vector"
	;

export type FormElementType =
	"text" | "number" | "password" | "email" | "color" | "range" | // Basic elements
	"date" | "datetime-local" |
	"id" |
	"textarea" |
	"select" | "search" |
	"fraction" |
	"vector" |
	"switch" |
	"codearea" |
	"keyboard" |
	"json" |
	"theme" | "chapter" | "deck"

export interface FormMakerPropsNewType {
	type?: FormElementType,
	label?: string
	icon?: boolean | string
	prepend?: boolean | string
	inlineLabel?: boolean
	btn?: boolean | string
	clearable?: boolean
	message?: string
	xs?: boolean
	sm?: boolean
	xl?: boolean
	focus?: boolean
	output?: boolean | string
	inputClass?: false | string
}
