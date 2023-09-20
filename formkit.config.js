import {fr} from '@formkit/i18n'
import {genesisIcons} from "@formkit/icons";
import {generateClasses} from "@formkit/themes";
import myTailwindTheme from "./tailwind-theme";
import {createFloatingLabelsPlugin} from "@formkit/addons";
import './resources/css/FormKitFloatingLabel.css'

import text from "./resources/js/FormKitText";


export default {
	icons: {
		...genesisIcons
	},
	config: {
		classes: generateClasses(myTailwindTheme),
		locales: {fr},
		locale: 'fr',

	},
	plugins: [
		createFloatingLabelsPlugin({
			useAsDefault: true
		})
	],
	inputs : {
		text
	}
}
