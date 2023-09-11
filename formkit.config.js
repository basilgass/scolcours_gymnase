import {fr} from '@formkit/i18n'
import {genesisIcons} from "@formkit/icons";
import {generateClasses} from "@formkit/themes";
import myTailwindTheme from "./tailwind-theme";
import {createFloatingLabelsPlugin} from "@formkit/addons";
import '@formkit/addons/css/floatingLabels.css'

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
	]
}
