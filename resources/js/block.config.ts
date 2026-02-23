export interface IblockType {
	title: string,
	icon: string,
	style: {
		header: string,
		body: string
	},
	collapse?: boolean,
	content?: {
		prepend?: string,
		append?: string
	}
}

export const blockTypes: Record<string, IblockType> = {
	definition: {
		title: "définition",
		icon: "bi bi-book",
		style: {
			header: "bg-lime-400 text-lime-900",
			body: "border border-l-8 border-lime-400",
		},
	},
	theorem: {
		title: "théorème",
		icon: "bi bi-book",
		style: {
			header: "bg-amber-600 text-amber-50",
			body: "border border-l-8 border-amber-600",
		},
	},
	proof: {
		title: "preuve",
		icon: "bi bi-shield-check",
		style: {
			header: "bg-emerald-600 text-emerald-50",
			body: "border border-l-8 border-emerald-600",
		},
		collapse: true,
		content: {
			append: "<i class='bi bi-square-fill'></i> {.text-right}"
		}
	},
	property: {
		title: "propriété",
		icon: "bi bi-wrench",
		style: {
			header: "bg-purple-600 text-purple-50  dark:bg-purple-600 dark:text-purple-50",
			body: "border border-l-8 border-purple-600",
		},
	},
	remark: {
		title: "remarque",
		icon: "bi bi-chat",
		style: {
			header: "bg-cyan-300 text-cyan-700",
			body: "border border-l-8 border-cyan-300",
		},
	},
	example: {
		title: "exemple",
		icon: "bi bi-calculator",
		style: {
			header: "bg-gray-200 text-gray-800",
			body: "",
		},
	},
	danger: {
		title: "attention",
		icon: "bi bi-exclamation-triangle",
		style: {
			header: "bg-red-700 text-red-50",
			body: "border border-red-700",
		},
	}
}
