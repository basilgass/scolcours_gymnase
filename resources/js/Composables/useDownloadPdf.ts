import axios from "axios"
import {AxiosErrorMessage, flashInterface} from "@/types"
import {inject} from "vue"

// BUG: flash does not work in composable -> need to move to a pinia store !
const flash = inject<flashInterface>('flash')

export interface pdf_config {
	title: string,
	slug: string,
	theme?: string,
	tex?: string,
	questions?: { question: string, answer: string }[],
	template?: "latex.simple" | "latex.questions"
}

export function usePdf() {
	function LaTeX(title: string, slug: string, tex: string) {
		download({title, slug, tex})
	}

	function download(content: pdf_config) {
		axios
			.post(route("latex.pdf"), {
				template: content.template ?? "latex.simple",
				title: content.title,
				slug: content.slug,
				theme: content.theme ?? "divers",
				content: content.tex ? `\\[ ${content.tex} \\]` : '',
				questions: content.questions ?? []
			})
			.then((res) => {
				flash.success(
					"PDF généré avec succès",
					{
						link: {
							label: "Voir le PDF",
							url: route("latex.download", [res.data.slug]),
							external: true
						},
						timeout: 5000
					}
				)

				document.location.href = route("latex.download", [res.data.slug])
			})
			.catch((err: AxiosErrorMessage) => {
				flash.error(err.response.data.message)
				// console.log(err.response.data.message)
				// pdfError.value = err.response.data.message
			})
	}

	return {
		LaTeX,
		download
	}
}
