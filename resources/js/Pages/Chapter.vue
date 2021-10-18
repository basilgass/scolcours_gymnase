<template>
  {{ chapter.title }}

  <p>{{ chapter.body }}</p>
</template>
<script>
export default {
    name: "Chapter",
    props: {
        chapter: String
    }
}
</script>

<style scoped>

</style>
