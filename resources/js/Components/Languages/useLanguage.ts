import { TranslationUnitInterfaceExtended, TranslationWord } from "@/types/modelInterfaces"
import { Random } from "pimath"


export function useLanguage(units: TranslationUnitInterfaceExtended[]) {


	const selectedWords = function(random?: boolean): TranslationWord[] {
		// All words available
		let words = []
		for (const values of units.map(x => x.words)) {
			words = words.concat(values)
		}

		return (random === undefined || random) ? Random.shuffle(words) : words
	}

	return { selectedWords }
}
