import { PageProps as InertiaPageProps } from "@inertiajs/core"
import { AxiosInstance } from "axios"
import ziggyRoute, { Config as ZiggyConfig } from "ziggy-js"
import { PageProps as AppPageProps } from "./"

declare global {
	interface Windows {
		axios: AxiosInstance
	}

	let route: typeof ziggyRoute
	let Ziggy: ZiggyConfig
}

declare module "vue" {
	interface ComponentCustomProperties {
		route: typeof ZiggyRoute;
	}

}

declare module "@inertiajs/core" {
	interface PageProps extends InertiaPageProps, AppPageProps {
	}
}
