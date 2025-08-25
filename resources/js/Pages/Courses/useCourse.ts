import {lessonableClassName, lessonableModel} from "@/types/lessonInterfaces.ts"
import {FormElementType} from "@/Components/Form/FormMakerInterface.ts"


export function useCourse() {

	function lessonScoreRulesMap(lessonable: lessonableClassName): Record<string, FormElementType> {
		switch (lessonable) {
			case "Post":
				return {target: 'number', question_ids: 'text'} // TODO: FormMaker Json type cannot handle this.
			case "Challenge":
				return {target: "number", level: "number", occurrences: "number"}
			case "Generator":
				return {target: "number", occurrences: "number"}
			case "Deck":
				return {target: "number"}
			default:
				return {}
		}
	}


	return {
		lessonScoreRulesMap
	}
}
