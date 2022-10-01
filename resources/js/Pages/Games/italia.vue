<template>
	<article>
		<ArticleTitle title="Italia Unit" />

		<div
			v-if="cards.length>0"
			class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4"
		>
			<div
				v-for="(card, index) in cards"
				:key="index"
				class="bg-white border rounded h-32 grid place-items-center p-3 cursor-pointer transform-all duration-300"
				:class="{
					'bg-green-600': card.found,
					'bg-amber-400': card.selected
				}"
				@click="showAllCards?null:selectCard(card)"
			>
				<span v-show="showAllCards || card.found || card.selected">
					{{ card.text }}
				</span>
			</div>
		</div>

		<div
			v-if="gameStopped"
			class="mt-10 flex items-end justify-between"
		>
			<button
				class="btn-primary"
				@click="startGame"
			>
				Commencer
			</button>

			<form-number
				v-model="numberOfCards"
				label="nombre de cartes"
				name="nombre de cartes"
			/>

			<form-input
				v-model="unitsSelection"
				label="sélection des unités"
				name="selectionunit"
			/>
		</div>
		<div
			v-else
			class="mt-10 flex justify-between"
		>
			<button
				v-show="!gameStopped"
				class="btn btn-xs bg-white"
				@click="showAllCards=!showAllCards"
			>
				Afficher toutes les fiches
			</button>
		</div>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import FormNumber from "@/Components/Form/FormNumber.vue"

// Units
const unit0 = [
	["undici", "onze"],
	["la pagina", "la page"],
	["ventisette", "vingt-sept"],
	["la classe", "la classe"],
	["portoghese, i", "portugais"],
	["nove", "neuf"],
	["americano, a, i, e", "américain"],
	["il nome", "le nom"],
	["come", "comment"],
	["dire (v. irregolare)", "dire"],
	["l'attività", "l'activité"],
	["la risposta", "la réponse"],
	["marocchino, a, i, e", "marocain"],
	["due", "deux"],
	["sbagliato, a, i, e", "FAUX"],
	["chi", "qui"],
	["chiedere (chiesto)", "demander"],
	["la compagna", "la camarade"],
	["la frase", "la phrase"],
	["Questo è Giovanni.", "Lui c'est Jean."],
	["formare", "former"],
	["Non mangio gli spaghetti.", "Je ne mange pas les spaghetti."],
	["il compito", "le devoir"],
	["uno", "un"],
	["il computer", "l'ordinateur"],
	["l'insegnante", "l'enseignante"],
	["dodici", "douze"],
	["la macchina", "la voiture"],
	["e", "et"],
	["la studentessa", "l'étudiante"],
	["Come ti chiami?", "Comment t'appelles-tu ?"],
	["diciassette", "dix-sept"],
	["questo, a, i, e", "ce, cette, ces"],
	["la tabella (femm.)", "le tableau"],
	["ripetere", "répéter"],
	["presentare", "présenter"],
	["prego", "de rien"],
	["straniero, a, i, e", "étranger"],
	["la persona", "la personne"],
	["la parola", "le, mot, la parole"],
	["completare", "compléter"],
	["l'immagine", "l'image"],
	["la sorella", "la soeur"],
	["tedesco, a, i, e", "allemand"],
	["l'età (femm.)", "l'âge"],
	["l'aggettivo", "l'adjectif"],
	["ciao", "salut"],
	["la sedia", "la chaise"],
	["quindici", "quinze"],
	["la professoressa", "la professeure"],
	["femminile, i", "féminin"],
	["avere (v. irregolare)", "avoir"],
	["(che) cosa", "que, quoi, qu'est-ce que"],
	["Chi sei?", "Qui es-tu ?"],
	["plurale, i", "pluriel"],
	["tredici", "treize"],
	["dieci", "dix"],
	["leggere (letto)", "lire"],
	["Ho 17 anni.", "J'ai 17 ans"],
	["o", "ou (bien)"],
	["lo studente", "l'étudiant"],
	["Le persone", "Les personnes"],
	["no", "non"],
	["la pronuncia", "la prononciation"],
	["spagnolo, a, i, e", "espagnol"],
	["quattordici", "quatorze"],
	["l'allieva", "l'élève (fém.)"],
	["quattro", "quatre"],
	["sei", "six"],
	["la canzone", "la chanson"],
	["il libro", "le livre"],
	["gli spaghetti", "les spaghetti"],
	["lo zaino", "le sac à dos"],
	["quanto, a, i, e", "combien (de)"],
	["piacere", "enchanté (e)"],
	["l'autobus", "le bus"],
	["svizzero, a, i, e", "suisse"],
	["zero", "zéro"],
	["grazie", "merci"],
	["salutare", "saluer"],
	["il banco", "le banc"],
	["il calcio", "le foot"],
	["la moda", "la mode"],
	["Quanti anni hai?", "Quel âge as-tu?"],
	["argentino, a, i, e", "argentin"],
	["fare lo spelling (v. irregolare)", "épeler"],
	["fare (v. irregolare)", "faire"],
	["otto", "huit"],
	["ascoltare", "écouter"],
	["ventinove", "vingt-neuf"],
	["ventotto", "vingt-huit"],
	["L'alfabeto", "L'alphabet"],
	["il numero", "le nombre"],
	["il fratello", "le frère"],
	["la penna", "la plume"],
	["La lingua e la scuola", "La langue et l'école"],
	["lavorare", "travailler"],
	["sì", "oui"],
	["il dialogo, i dialoghi", "le dialogue"],
	["il materiale", "le matériel"],
	["presentarsi*", "se présenter"],
	["sedici", "seize"],
	["singolare, i", "singulier"],
	["venticinque", "vingt-cinq"],
	["trenta", "trente"],
	["il sostantivo", "le substantif"],
	["Qual è", "quel(le) est"],
	["Benvenuti!", "Bienvenus!"],
	["Scusa!", "Excuse-moi !"],
	["il quaderno", "le cahier"],
	["fare una domanda (v. irregolare)", "poser une question"],
	["ventitré", "vingt-trois"],
	["la coppia(femm.)", "le couple"],
	["inglese, i", "anglais"],
	["l'esempio", "l'exemple"],
	["chiamarsi*", "s'appeler"],
	["finire (-isco)", "finir"],
	["chiamare", "appeler"],
	["Ti presento Carlo.", "Je te présente Carlo."],
	["ventuno", "vingt-et-un"],
	["la foto", "la photo"],
	["l'origine", "l'origine"],
	["l'allievo", "l'élève (masc.)"],
	["la lavagna (femm.)", "le tableau noir"],
	["scrivere (scritto)", "écrire"],
	["il gelato (masc.)", "la glace (miam!)"],
	["giusto, a, i, e", "juste"],
	["ventisei", "vingt-six"],
	["diciannove", "dix-neuf"],
	["la ragazza", "la fille"],
	["brasiliano, a, i, e", "brésilien"],
	["osservare", "observer"],
	["I numeri (1)", "Les nombres (1)"],
	["italiano, a, i, e", "italien"],
	["La nazionalità", "La nationalité"],
	["la consonante", "la consonne"],
	["il corso", "le cours"],
	["Come va?", "Comment ça va ?"],
	["il manuale", "le manuel"],
	["Scusi!", "Excusez-moi ! (politesse)"],
	["la domanda", "la question"],
	["essere* (v. irregolare)", "être"],
	["la scuola", "l'école"],
	["la lingua", "la langue"],
	["(Che) cosa mangi?", "Que manges-tu?"],
	["australiano, a, i, e", "australien"],
	["ventidue", "vingt-deux"],
	["il compagno", "le camarade"],
	["il suono", "le son"],
	["la vocale", "la voyelle"],
	["costruire (-isco)", "construire"],
	["ventiquattro", "vingt-quatre"],
	["il professore", "le professeur"],
	["il ragazzo", "le garçon"],
	["indicare", "indiquer"],
	["l'azione", "l'action"],
	["l'insegnante", "l'enseignant"],
	["l'aula", "la salle de classe"],
	["la cosa", "la chose"],
	["cominciare", "commencer"],
	["di niente", "de rien"],
	["non", "ne... pas"],
	["la lezione", "la leçon"],
	["tre", "trois"],
	["maschile, i", "masculin"],
	["lo sport", "le sport"],
	["il foglio (masc.)", "la feuille (papier)"],
	["Qual è il tuo numero di telefono?", "Quel est ton numéro de téléphone ?"],
	["la regola", "la règle"],
	["il panino", "le sandwich"],
	["diciotto", "dix-huit"],
	["per favore", "s'il te/vous plaît"],
	["sette", "sept"],
	["cinque", "cinq"],
	["la pizza", "la pizza"],
	["venti", "vingt"],
	["la lettera", "la lettre"],

]
const unit1 = [
	["Un nuovo inizio", "Un nouveau départ"],
	["Il corpo", "Le corps"],
	["l'uomo, gli uomini", "l'homme"],
	["la donna", "la femme"],
	["il fisico", "le physique"],
	["il viso", "le visage"],
	["la faccia, -ce", "la face, le visage"],
	["il capello", "le cheveu"],
	["l'occhio", "l'œil"],
	["la bocca, -che", "la bouche"],
	["il naso", "le nez"],
	["la testa", "la tête"],
	["la fronte (femm.)", "le front"],
	["il braccio, le braccia", "le bras"],
	["il dito, le dita", "le doigt"],
	["il ginocchio, le ginocchia", "le genou"],
	["l'orecchio, le orecchie", "l'oreille"],
	["la gamba", "la jambe"],
	["il piede", "le pied"],
	["la pelle", "la peau"],
	["i baffi", "les moustaches"],
	["la barba", "la barbe"],
	["gli occhiali", "les lunettes"],
	["Il lavoro", "Le travail"],
	["l'inizio", "le début"],
	["la fine", "la fin"],
	["la notizia", "la nouvelle"],
	["il direttore", "le directeur"],
	["la direttrice", "la directrice"],
	["l'agenzia", "l'agence"],
	["il collega", "le collègue"],
	["la collega", "la collègue"],
	["l'ufficio", "le bureau"],
	["l'informazione", "l'information"],
	["il giornale", "le journal"],
	["l'appuntamento", "le rendez-vous"],
	["l'amore", "l'amour"],
	["il ristorante", "le restaurant"],
	["la città", "la ville"],
	["l'università", "l'université"],
	["il bar", "le bar"],
	["la biblioteca", "la bibliothèque"],
	["la regione", "la région"],
	["Le caratteristiche fisiche", "Les caractéristiques physiques"],
	["giovane, i", "jeune"],
	["vecchio, a, i, e", "vieux"],
	["bello, a, i, e", "beau"],
	["brutto, a, i, e", "laid"],
	["carino, a, i, e", "joli, mignon"],
	["riccio, a, i, e", "frisé"],
	["liscio, a, i, e", "lisse"],
	["corto, a, i, e", "court"],
	["lungo, a, i, e", "long"],
	["piccolo, a, i, e", "petit"],
	["grande, i", "grand"],
	["alto, a, i, e", "haut, de grande taille"],
	["basso, a, i, e", "bas, de petite taille"],
	["magro, a, i, e", "maigre"],
	["grasso, a, i, e", "gras"],
	["calvo, a, i, e", "chauve"],
	["scuro, a, i, e", "foncé"],
	["chiaro, a, i, e", "clair"],
	["Il carattere", "Le caractère"],
	["gentile, i", "gentil"],
	["cattivo, a, i, e", "méchant"],
	["simpatico, a, i, e", "sympatique"],
	["antipatico, a, i, e", "antipatique"],
	["allegro, a, i, e", "joyeux"],
	["felice, i", "heureux"],
	["contento, a, i, e", "content"],
	["sorridente, i", "souriant"],
	["triste, i", "triste"],
	["cortese, i", "poli"],
	["scortese, i", "impoli"],
	["fortunato, a, i, e", "chanceux"],
	["sfortunato, a, i, e", "malchanceux"],
	["vero, a, i, e", "vrai"],
	["falso, a, i, e", "faux"],
	["interessante, i", "intéressant"],
	["I colori", "Les couleurs"],
	["il colore (masc.)", "la couleur"],
	["A colori.", "En couleurs."],
	["bianco, a, i, e", "blanc"],
	["nero, a, i, e", "noir"],
	["In bianco e nero.", "En noir et blanc."],
	["biondo, a, i, e", "blond"],
	["castano, a, i, e", "châtain"],
	["bruno, a, i, e", "brun"],
	["blu (inv.)", "bleu"],
	["viola (inv.)", "violet"],
	["rosa (inv.)", "rose"],
	["azzurro, a, i, e", "bleu ciel"],
	["celeste, i", "bleu clair"],
	["rosso, a, i, e", "rouge, roux"],
	["giallo, a, i, e", "jaune"],
	["verde, i", "vert"],
	["grigio, a, i, e", "gris"],
	["marrone, i", "brun, marron"],
	["arancione, i", "orange"],
	["arrivare*", "arriver"],
	["usare", "utiliser"],
	["conoscere", "connaître"],
	["corrispondere (corrisposto)", "correspondre"],
	["descrivere (descritto)", "décrire"],
	["prendere (preso)", "prendre"],
	["aprire (aperto)", "ouvrir"],
	["capire (-isco)", "comprendre"],
	["dare del tu (v. irregolare)", "tutoyer"],
	["dare del lei (v. irregolare)", "vouvoyer"],
	["ecco", "voici"],
	["ancora", "encore"],
	["sempre", "toujours"],
	["mai", "jamais"],
	["ma", "mais"],
	["dove", "où"],
	["Dove sei?", "Où es-tu?"],
	["quando", "quand"],
	["che", "quel(s), quelle(s)"],
	["Che lavoro fai?", "Quel est ton métier ?"],
	["In che anno sei nato / a?", "En quelle année es-tu né(e) ?"],
	["Sono nato / a nel 1998.", "Je suis né(e) en 1998."],
	["quale, i", "quel(s) ; quelle(s)"],
	["Quali lingue parli?", "Quelles langues parles-tu ?"],
	["alcuni, e", "quelques (+ noms au pluriel)"],
	["Alcuni uomini.", "Quelques hommes."],
	["ogni + singolare", "chaque"],
	["perché", "pourquoi; parce que"],
	["Buongiorno.", "Bonjour."],
	["Buonasera.", "Bonsoir."],
	["Buonanotte.", "Bonne nuit."],
	["Arrivederci.", "Au revoir."],
	["Come stai?", "Comment vas-tu ?"],
	["Bene, e tu?", "Bien, et toi"],
	["Di dove sei?", "D'où es-tu?"],
	["Dove abiti?", "Où habites-tu ?"],
	["Che fortuna!", "Quelle chance!"],
	["Complimenti!", "Félicitations!"],
	["Secondo me...", "Selon moi..."],
	["(Che) cosa significa... ?", "Que signifie... ?"],
	["Come si dice... in italiano?", "Comment dit-on... en italien ?"],
	["Come si scrive... ?", "Comment écrit-on... ?"],
	["Ho capito / Non ho capito.", "J'ai compris / Je n'ai pas compris."],
	["Può ripetere per favore?", "Pouvez-vous répéter s'il vous plaît ? (politesse)"],
	["È giusto? / È sbagliato?", "C'est juste ? / C'est faux ?"],
	["La forma di cortesia.", "La forme de politesse."],

]

let vocabulare = [
	unit0,
	unit1
]


let availableWords = ref([]),
	cards = ref([]),
	unitsSelection = ref("1"),
	units = computed(() => {
		return unitsSelection.value.split(",").filter(x=>!isNaN(x)).map(x => +x)
	}),
	showAllCards = ref(false),
	numberOfCards = ref(12),
	gameStopped = ref(true)

let startGame = function () {
	generateCards()
}
let generateCards = function () {
	let words = []
	for (let unit in vocabulare) {
		if (units.value.includes(+unit)) {
			words = words.concat(vocabulare[unit])
		}
	}

	availableWords.value = PiMath.Random.array(words, numberOfCards.value)

	let cardsList = []
	for (let word of availableWords.value) {
		cardsList.push(word[0])
		cardsList.push(word[1])
	}

	for (let word of PiMath.Random.shuffle(cardsList)) {
		cards.value.push({
			text: word,
			selected: false,
			found: false
		})
	}

	gameStopped.value = false
}

let selectCard = function (card) {
	if (card.found) {
		return
	}

	card.selected = true

	// get all selected cards.
	const selectedCards = cards.value.filter(c => c.selected)

	if (selectedCards.length === 1) {
		return
	}
	if (selectedCards.length > 2) {
		cards.value.map(c => c.selected = false)
		return
	}
	if (selectedCards.length === 2) {
		// Il y a deux cartes sélectionnées.
		for (let word of availableWords.value) {
			if ((selectedCards[0].text === word[0] && selectedCards[1].text === word[1]) ||
				selectedCards[0].text === word[1] && selectedCards[1].text === word[0]) {
				selectedCards.map(c => {
					c.selected = false
					c.found = true
				})

				// On vérifie si tout est terminé
				if (cards.value.filter(x => x.found).length === cards.value.length) {
					gameStopped.value = true
				}

				return
			}
		}
	}

	setTimeout(() => {
		selectedCards.map(c => {
			c.selected = false
		})
	}, 500)
}

</script>
