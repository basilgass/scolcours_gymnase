import {ref} from "vue"
import {useWrongAnswerAnimation} from "@/Composables/useHelpers"


let props = defineProps({
	options: {type: String},
	answer: {type: String}
})
let emits = defineEmits(["change", "tex", "raw", "validate"])
let validateButton = ref(null),
	resetKeyStrokes = function () {
	},
	wrongAnswer = function () {
		useWrongAnswerAnimation(validateButton.value)
	},
	getTex = function (value) {
		emits("tex", "")
		return ""
	},
	getRaw = function (value) {
		let result = props.options.split("\n").map(x=>`- ${x}`).join("\n")
		emits("raw", result)
		return result
	},
	btnValidate = function () {
		let result = 0
		for(let i=1; i<=sortableItems.value.length; i++){
			if(sortableItems.value[i-1].id!==i){
				result++
			}
		}

		emits("change", `${result>0?result+" faute(s)":0}`)
		emits("tex", "")
		emits("raw", "")
		emits("validate", `${result>0?result+" faute(s)":0}`)
	}
defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})
