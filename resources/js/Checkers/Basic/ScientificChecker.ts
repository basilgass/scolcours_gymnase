import { CheckerAbstract } from "@/Checkers/CheckerAbstract"
import { customCheck } from "@/Composables/checkersConfig"

const name = "scientific"
const description = `scientific|scn,[paramètres]

//TODO: scn: mode stricte
**paramètres**
- [1,2,3,4,...]: nombre de chiffre après la virgule
- s: strict (1.2 ne passe pas pour 1.20)
`

export class ScientificChecker extends CheckerAbstract {
    private digits: number
    constructor(config:string[]|string) {
        super(config)
        this.name = name
        this.description = description
        this.digits = isNaN(+this.config[0])?0:+this.config[0]
    }

    check(expected: string, given: string): { result: boolean; message: string } {
        // Le résultat est exactement ce qui est demandé
        if (given === expected) {
            return {
                result: true,
                message: ""
            }
        }

        // On vérifie que le format est bien de type scientifique.
        const PS = +(given.split("*")[0]),
            OG = +(given.split("10^")[1] || 0),
            ePS = +(expected.split("*")[0]),
            eOG = +(expected.split("10^")[1] || 0)

        if (!given.includes("*10^")) {
            return {
                result: false,
                message: "le format de réponse n'est pas une notation scientifique."
            }
        }

        // On vérifie la partie significative
        if (PS < 1 || PS >= 10) {
            return {
                result: false,
                message: "la partie significative n'est pas entre 1 et 10 (non compris)"
            }
        }

        if (PS !== ePS) {
            return {
                result: false,
                message: "erreur dans la partie significative: " + customCheck(`number,${this.digits}`, ePS.toString(), PS.toString()).message
            }
        }


        // On vérifie l'ordre de grandeur.
        if (OG !== eOG) {
            return {
                result: false,
                message: "l'ordre de grandeur n'est pas juste.."
            }
        }

    }

    get format(): string {
        return this.digits ?
            "réponse en notation scientifique" :
            `réponse en notation scientifique à ${this.digits} chiffre(s) significatif(s)`
    }

}
