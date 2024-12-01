import { TranslationUnitInterfaceExtended, TranslationWord } from "@/types/modelInterfaces"
import { Random } from "pimath"
import { Ref } from "vue"


export function useLanguage(units:Ref<TranslationUnitInterfaceExtended[]>) {

	const selectedWords = function(random?: boolean): TranslationWord[] {
		// All words available
		let words = []
		const selectedUnits = units.value.filter(x => x.selected)

		for (const values of selectedUnits.map(x => x.words)) {
			words = words.concat(values)
		}

		return (random === undefined || random) ? Random.shuffle(words) : words
	}

	return { selectedWords }
}
