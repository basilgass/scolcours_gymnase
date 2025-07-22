import type {IMacroRecords} from "@/helpers/Macros/macros_interface.ts"

const javascript_macros_suffix: IMacroRecords = {}

export const javascript_macros: IMacroRecords = {
	"PRN": {
		template: "PiMath.Random.number(@)",
	},
	"PRP": {
		template: "PiMath.Random.polynom({degree: @})"
	},
	...javascript_macros_suffix
}
