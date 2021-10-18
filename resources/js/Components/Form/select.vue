<template>
  <form-field>
    <form-label
      :name="name"
      :label="label"
    />

    <select
      :id="name"
      :name="name"
      class="border border-gray-200 p-2 w-full rounded"
    >
      <slot />
    </select>
    <form-error :message="''" />
  </form-field>
</template>
<script>
import FormField from "@/Components/Form/field";
import FormLabel from "@/Components/Form/label";
import FormError from "@/Components/Form/error";

export default {
    name: 'FormSelect',
    components: {FormError, FormLabel, FormField},
    props: {
        name: {type: String, required: true},
        label: {type: String, default: ''},
    }
}
</script>
