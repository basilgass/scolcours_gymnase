import {PageProps as InertiaPageProps} from "@inertiajs/core"
import ziggyRoute, {Config as ziggyConfig} from "ziggy-js"
import {PageProps as AppPageProps} from "./"

declare global {
	let route: typeof ziggyRoute
	let Ziggy: ziggyConfig
}

declare module "vue" {
	interface ComponentCustomProperties {
		route: typeof ziggyRoute;
	}

}

declare module "@inertiajs/core" {
	interface PageProps extends InertiaPageProps, AppPageProps {
	}
}
