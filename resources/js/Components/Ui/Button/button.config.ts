import {ThemesSlug} from "@/types"

export type ButtonAction =
	"admin" |
	"add" |
	"cancel" |
	"delete" |
	"duplicate" |
	"edit" |
	"generate" |
	"save" |
	"visit"


export type ButtonColor =
	"default" |
	"active" |
	"primary" |
	"action" |
	"success" |
	"warning" |
	"danger" |
	"console" |
	"card" |
	"duplicate" |
	"scolcours" | & ThemesSlug

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'hover'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonActionValue {
	label: string,
	icon: string,
	color: ButtonColor
}

export const buttonActionMap: Record<ButtonAction, ButtonActionValue> = {
	admin: {
		label: "admin",
		icon: "bi bi-gear",
		color: "console"
	},
	add: {
		label: "ajouter",
		icon: "bi bi-plus-lg",
		color: "primary"
	},
	cancel: {
		label: "annuler",
		icon: "bi bi-x-lg",
		color: "warning"
	},
	delete: {
		label: "supprimer",
		icon: "bi bi-trash",
		color: "danger"
	},
	duplicate: {
		label: "dupliquer",
		icon: "bi bi-copy",
		color: "duplicate"
	},
	edit: {
		label: "modifier",
		icon: "bi bi-pencil",
		color: "primary"
	},
	generate: {
		label: "générer",
		icon: "bi bi-shuffle",
		color: "action"
	},
	save: {
		label: "enregistrer",
		icon: "bi bi-save",
		color: "primary"
	},
	visit: {
		label: 'visiter',
		icon: "bi bi-eye",
		color: "default"
	}
}

export const buttonColorMap: Record<ButtonColor, Record<ButtonVariant, string>> = {
	default: {
		solid: "bg-button text-button",
		outline: "border-button text-button",
		ghost: "text-button bg-transparent border-transparent",
		hover: "bg-slate-100"
	},
	primary: {
		solid: "bg-primary text-white",
		outline: "border-primary text-primary",
		ghost: "text-primary bg-transparent border-transparent",
		hover: "warning"
	},
	action: {
		solid: "bg-edit text-white",
		outline: "border-edit text-edit",
		ghost: "text-edit bg-transparent border-transparent",
		hover: "warning"
	},
	active: {
		solid: "bg-active text-white",
		outline: "border-active text-active",
		ghost: "text-active bg-transparent border-transparent",
		hover: "warning"
	},
	console: {
		solid: "bg-console text-white",
		outline: "border-console",
		ghost: "text-console bg-transparent border-transparent",
		hover: "warning"
	},
	danger: {
		solid: "bg-danger text-white",
		outline: "border-danger text-danger",
		ghost: "text-danger bg-transparent border-transparent",
		hover: "warning"
	},
	warning: {
		solid: "bg-warning text-white",
		outline: "border-warning text-warning",
		ghost: "text-warning bg-transparent border-transparent",
		hover: "warning"
	},
	success: {
		solid: "bg-active text-white",
		outline: "border-active text-active",
		ghost: "text-active bg-transparent border-transparent",
		hover: "warning"
	},
	algebre: {
		solid: "bg-algebre text-white",
		outline: "outline border-algebre text-algebre",
		ghost: "text-algebre bg-transparent border-transparent",
		hover: "bg-algebre-light"
	},
	analyse: {
		solid: "bg-analyse text-white",
		outline: "outline border-analyse text-analyse",
		ghost: "text-analyse bg-transparent border-transparent",
		hover: "bg-analyse-light"
	},
	geometrie: {
		solid: "bg-geometrie text-white",
		outline: "outline border-geometrie text-geometrie",
		ghost: "text-geometrie bg-transparent border-transparent",
		hover: "bg-geometrie-light"
	},
	arithmetique: {
		solid: "bg-arithmetique text-white",
		outline: "outline border-arithmetique text-arithmetique",
		ghost: "text-arithmetique bg-transparent border-transparent",
		hover: "bg-arithmetique-light"
	},
	jeux: {
		solid: "bg-jeux text-white",
		outline: "outline border-jeux text-jeux",
		ghost: "text-jeux bg-transparent border-transparent",
		hover: "bg-jeux-light"
	},
	statistiques: {
		solid: "bg-statistiques text-white",
		outline: "outline border-statistiques text-statistiques",
		ghost: "text-statistiques bg-transparent border-transparent",
		hover: "bg-statistiques-light"
	},
	tools: {
		solid: "bg-tools text-white",
		outline: "outline border-tools text-tools",
		ghost: "text-tools bg-transparent border-transparent",
		hover: "bg-tools-light"
	},
	scolcours: {
		solid: "bg-scolcours text-white",
		outline: "outline border-scolcours text-scolcours",
		ghost: "text-scolcours bg-transparent border-transparent",
		hover: "bg-scolcours-light"
	},
	card: {
		solid: "bg-slate-200 text-slate-500",
		outline: "outline border bg-slate-200 text-slate-600",
		ghost: "text-slate-600 bg-transparent border-transparent",
		hover: "bg-slate-300"
	},
	duplicate: {
		solid: "bg-indigo-500 text-white",
		outline: "border-indigo-500 text-indigo-500",
		ghost: "text-indigo-500 bg-transparent border-transparent",
		hover: "bg-indigo-100"
	}
}

