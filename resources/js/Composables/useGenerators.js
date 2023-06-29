import {unref} from "vue"

// export function makeFunction(code) {
//
// 	try{
// 		return new Function(
// 			"PiMath",
// 			code
// 		)
// 	}catch(e){
// 		console.log("ERREUR")
// 		console.warn(e)
// 	}
//
// 	return new Function("PiMath", "return {question:'erreur dans le générateur', answer:''}")
// }

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
