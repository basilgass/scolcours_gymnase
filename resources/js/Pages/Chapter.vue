<template>
  {{ chapter.title }}

  <p>{{ chapter.body }}</p>

    <component :is="chapterComponent"/>
</template>
<script >
import Layout from "@/Pages/Layout";
import {defineAsyncComponent} from "vue";

export default {
    name: "Chapter",
    components: {  },
    layout: Layout,
    props: {
        chapter: {type: Object, default: ()=>{}},
        hasChapterComponent: {type: Boolean, default: false}
    },
    computed: {
        chapterComponent() {
            if(this.hasChapterComponent){
                return defineAsyncComponent(()=>import(`@/Chapters/${this.$page.props.theme.slug}/${this.chapter.slug}`))
            }
        }
    }
}
</script>

<style scoped>

</style>
