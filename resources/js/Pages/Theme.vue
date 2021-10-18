<template>
    Something here
</template>
<script>
import MainHeader from "@/Components/MainHeader";
import Layout from "@/Pages/Layout";

export default {
    name: "Theme",
    layout: Layout,
    components: {MainHeader},
    props: {
        theme: Object,
        chapters: Array
    }
}
</script>

<style scoped>

</style>
