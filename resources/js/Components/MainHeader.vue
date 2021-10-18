<template>
    <MainAside :showAside="showAside"/>
    <header :class="`scolcours-${theme.slug} shadow`">
        <div
            class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8
			text-white
			flex justify-between"
        >
            <div class="text-3xl">
                <i class="bi bi-list cursor-pointer"
                   @click="showAside=true"
                />
                <slot/>
            </div>

            <div>
                <div v-if="$page.props.auth.user">
                    <div class="relative cursor-pointer"
                         @click="showMenu = !showMenu"
                    >
                        {{ $page.props.auth.user.name }}
                        <div
                            v-if="showMenu"
                            class="w-40
						flex flex-col text-left space-y-1 py-2
						absolute top-5 -right-1 bg-white text-gray-800 border-gray-200 rounded shadow-lg"
                        >
                            <a
                                class="hover:bg-gray-100 px-3 py-2"
                                href="/dashboard"
                            >
                                profil
                            </a>

                            <Link as="button" class="text-left hover:bg-gray-100 px-3 py-2" href="/logout"
                                  method="post">se
                                déconnecter
                            </Link>

                        </div>
                    </div>
                </div>
                <div v-else>
                    <a href="/login">Se connecter</a>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import {Link} from '@inertiajs/inertia-vue3';
import MainAside from "@/Components/MainAside";

export default {
    name: "MainHeader",
    components: {MainAside, Link},
    props: {
        theme: Object,
        showMenu: {type: Boolean, default: false},
        showAside: {type: Boolean, default: false}
    },
}
</script>
