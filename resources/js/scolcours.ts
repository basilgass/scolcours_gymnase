export const ToolsModules = import.meta.glob('./Components/Tools/*.vue', {eager: false})
export const KeyboardsModules = import.meta.glob(['./Components/Keyboards/*.vue', '!./Components/Keyboards/KeyboardDisplay.vue', '!./Components/Keyboards/KeyboardValidateButton.vue'])
export const DevsModules = import.meta.glob('./Components/Devs/*.vue')


export const blockTypeDefault = {
	title: "",
	style: {
		header: "",
		body: ""
	}
}

export const blockTypes = {
	definition: {
		title: "définition",
		icon: "bi bi-book",
		style: {
			header: "bg-lime-50 text-lime-700",
			body: "border-l-8 border-lime-400 border-b border-b-lime-100"
		}
	},
	theorem: {
		title: "théorème",
		icon: "bi bi-book",
		style: {
			header: "bg-amber-50 text-amber-700",
			body: "border-l-8 border-amber-600 border-b border-b-amber-100"
		}
	},
	property: {
		title: "propriété",
		icon: "bi bi-wrench",
		style: {
			header: "bg-purple-50 text-purple-700",
			body: "border-l-8 border-purple-600 border-b border-b-purple-100"
		}
	},
	remark: {
		title: "remarque",
		icon: "bi bi-chat",
		style: {
			header: "bg-pink-50 text-pink-700",
			body: "border-l-8 border-pink-600 border-b border-b-pink-100"
		}
	},
	example: {
		title: "exemple",
		icon: "bi bi-calculator",
		style: {
			header: "bg-gray-100 text-gray-800",
			body: "border-0 border-b border-b-gray-100"
		}
	},
	danger: {
		title: "attention",
		icon: "bi bi-exclamation-triangle",
		style: {
			header: "bg-red-50 text-red-700",
			body: "border border-l-8 border-red-600"
		}
	},
}
