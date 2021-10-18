<template>
    <aside
        v-cloak
        v-show="showAside===true"
        class="fixed top-0 left-0 w-full z-50 sm:w-60 bg-black min-h-screen text-white">
        <div class="space-y-1 py-2 text-sm">
            <div class="relative">
                <i
                    class="absolute top-0 right-4 text-lg  text-gray-500 hover:text-white transition duration-300 bi bi-x-circle cursor-pointer"
                    @click="showAside=false"></i>
                <h3 class="text-lg mt-5 px-4">ScolCours</h3>
            </div>

            <a class="block
            transition duration-300
            hover:translate-x-2
            px-4 py-1"
               href="{{$route('home')}}">accueil</a>
            <hr/>
            <a v-for="theme of $page.props.themes" :key="`anchor-${theme.slug}`">
                HERE
                {{ theme.name }}
            </a>
            <!--            @foreach(cache()->get('themes') as $theme)-->
            <!--            <a href="{{route('articles.index', $theme->slug)}}"-->
            <!--               class="block-->
            <!--            transition duration-300-->
            <!--            hover:translate-x-2-->
            <!--            px-4 py-1">{{$theme->name}}</a>-->
            <!--            @endforeach-->
            <hr/>
        </div>
    </aside>

</template>

<script>
export default {
    name: "MainAside",
    props: {
        showAside: {type: Boolean, default: false}
    },
}
</script>

<style scoped>

</style>
