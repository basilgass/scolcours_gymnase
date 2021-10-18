<template>
  <p class="text-red-500 text-xs mt-2">
    {{ message }}
  </p>
</template>
<script>
export default {
    name: 'FormError',
    props: {message: {default: '', type: String}}
}
</script>
