import {unref} from "vue"

export function useGenerators(generators) {
	function getGenerator(level) {
		return unref(generators)[unref(level)-1]
	}

	const dftCode = `return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`

	return {
		generator: (level) => getGenerator(level),
		code: (level) => getGenerator(level).code ?? dftCode,
	}
}
