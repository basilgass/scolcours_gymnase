import { TranslationUnitInterfaceExtended, TranslationWord } from "@/types/modelInterfaces"
import { Random } from "pimath"
import { Ref } from "vue"


export function useLanguage(units:Ref<TranslationUnitInterfaceExtended[]>) {


	const selectedWords = function(random?: boolean): TranslationWord[] {
		// All words available
		let words = []
		for (const values of units.value.map(x => x.words)) {
			words = words.concat(values)
		}

		return (random === undefined || random) ? Random.shuffle(words) : words
	}

	return { selectedWords }
}
