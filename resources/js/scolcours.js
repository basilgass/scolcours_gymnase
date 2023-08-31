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
			body: "border-l-4 border-lime-400"
		}
	},
	theorem: {
		title: "théorème",
		icon: "bi bi-book",
		style: {
			header: "bg-amber-50 text-amber-700",
			body: "border-l-4 border-amber-600"
		}
	},
	property: {
		title: "propriété",
		icon: "bi bi-wrench",
		style: {
			header: "bg-purple-50 text-purple-700",
			body: "border-l-4 border-purple-600"
		}
	},
	remark: {
		title: "remarque",
		icon: "bi bi-chat",
		style: {
			header: "bg-pink-50 text-pink-700",
			body: "border-l-4 border-pink-600"
		}
	},
	example: {
		title: "exemple",
		icon: "bi bi-calculator",
		style: {
			header: "bg-gray-100 text-gray-800",
			body: "border-0"
		}
	},
	danger: {
		title: "attention",
		icon: "bi bi-exclamation-triangle",
		style: {
			header: "bg-red-50 text-red-700",
			body: "border border-l-4 border-red-600"
		}
	},
}
