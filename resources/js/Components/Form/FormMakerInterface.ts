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

export interface FormMakerPropsType {
	autoSize?: boolean;
	disabled?: boolean;
	focus?: boolean;
	fontCode?: boolean;
	inlineLabel?: boolean;
	inputClass?: string;
	label?: string;
	labelAsPlaceholder?: boolean;
	labelClass?: string;
	language?: "javascript" | "latex" | "json";
	message?: string;
	messageClass?: string;
	placeholder?: string;
	prepend?: string;
	resizable?: boolean;
	sm?: boolean;
	step?: number | string;
	type?: FormMakerInputsType;
	withIcon?: boolean | string;
	axios?: {
		model: "Post" | "Block" | "Question" | "Chapter",
		id: number,
		column: string,
		button?: boolean | string
	},
	fromUrl?: string;
	clearable?: boolean;
	helper?: boolean | string;
}
