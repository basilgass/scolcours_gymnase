import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { getCheckerClass } from "@/Composables/checkersConfig"

const name = "tos"
const description = `tos,[paramètres]

**paramètres**
aucun
`
export class TableofsignChecker extends CheckerAbstract {
    private grows: boolean
    private coords: boolean
    private secondaryChecker: CheckerAbstract

    constructor(config: string[] | string) {
        super(config)
        this.name = name
        this.description = description

        this.grows = this.config.includes('g') || this.config.includes('grows')
        this.coords = this.config.includes('c') || this.config.includes('coords')

        const chkClass = getCheckerClass(this.secondaryCheckerName || "exact")
        this.secondaryChecker = new chkClass(this.secondaryCheckerOptions)
    }

    get format(): string {
        if (this.coords) {
            return `Tableau de croissance avec min / max<br/>Coordonnées au format ${this.secondaryChecker.format}`
        } else if (this.grows) {
            return "Tableau de croissance"
        }
        return "Tableau de signes"
    }

    check(expected: string, given: string): { result: boolean; message: string } {
        if (expected !== given) {
            const zeroes = {
                    expected: expected.split("@")[0],
                    provided: given.split("@")[0]
                },
                signs = {
                    expected: expected.split("@")[1],
                    provided: given.split("@")[1] ?? ""
                },
                grows = {
                    expected: expected.split("@")[2] ?? "",
                    provided: given.split("@")[2] ?? ""
                },
                coords = {
                    expected: expected.split("@")[3] ?? "",
                    provided: given.split("@")[3] ?? ""
                }

            if (zeroes.expected !== zeroes.provided) {
                //TODO: compare each zeroes...
                return {
                    result: false,
                    message: "les zéros ne sont pas justes"
                }
            }

            if (signs.expected !== signs.provided) {
                return {
                    result: false,
                    message: "les signes ne sont pas justes"
                }
            }

            if (grows.expected !== grows.provided) {
                return {
                    result: false,
                    message: "la croissance n'est pas juste"
                }
            }

            // Check the coordinates
            if (coords.expected.length > 0) {
                const expectedCoordinates = coords.expected.split(","),
                    providedCoordinates = coords.provided.split(",")

                if (expectedCoordinates.length !== providedCoordinates.length) {
                    return {
                        result: false,
                        message: "toutes les valeurs des extrêmes n'ont pas été données..."
                    }
                }

                for (let i = 0; i < expectedCoordinates.length; i++) {
                    const check = this.secondaryChecker.check(expectedCoordinates[i], providedCoordinates[i])

                    if (!check.result) {
                        return {
                            result: false,
                            message: `il y a une erreur avec ${i === 0 ? "la 1ère" : "la " + (i + 1) + "ème"} coordonnée`
                        }
                    }
                }
            }


            return {
                result: false,
                message: "Il y a une erreur dans le tableau de signes."
            }
        }

        return {
            result: true,
            message: ""
        }
    }

}
