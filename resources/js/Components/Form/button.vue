<template>
  <form-field>
    <button
      type="submit"
      class="btn-form"
    >
      <slot />
    </button>
  </form-field>
</template>
<script>
import FormField from "@/Components/Form/field";

export default {
    components: {FormField}
}
</script>
