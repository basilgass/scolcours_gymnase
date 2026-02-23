import {PiRadian} from "@/PiMathExtended/PiRadian.ts"
import {rndPoints} from "@/PiMathExtended/RandomExt.ts";


export const PiMathExt = {
	Radian: PiRadian,
	tripletTarget: [
		5, 10, 13, 15, 17, 20, 25, 26, 29, 30, 34, 35, 37, 39, 40,
		41, 45, 50, 51, 52, 53, 55, 58, 60, 61, 65, 68, 70,
		73, 74, 75, 78, 80, 82, 85, 87, 89, 90, 91, 95, 97
	],
	Random: {
		points: rndPoints
	}
}
