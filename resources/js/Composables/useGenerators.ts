import {unref} from "vue"
import {GeneratorInterface} from "@/types/modelInterfaces";


export function useGenerators(generators: GeneratorInterface[]):
    {
        generator: (level: number) => GeneratorInterface,
        code: (level: number) => string
    } {

    function getGenerator(level: number): GeneratorInterface {
        return unref(generators)[unref(level) - 1]
    }

    const dftCode: string = `return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`

    return {
        generator: (level: number) => getGenerator(level),
        code: (level: number) => getGenerator(level).code ?? dftCode,
    }
}
