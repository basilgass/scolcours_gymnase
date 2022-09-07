export function SolutionChecker(options) {

	return {
		format: () => "Solution de la forme \\(\\mathcal{S}=\\{3;5\\}\\)",
		check: (expectedAnswer, answer = []) => {

			//TODO: SolutionChecker.check to handle

			return {
				result: expectedAnswer===answer,
				message: ''
			}
		}
	}
}
