<template>
  <form-field>
    <form-label
      :name="name"
      :label="label"
    />

    <input
      :id="name"
      class="border border-gray-200 p-2 w-full rounded"
      :name="name"
    >

    <form-error :name="name" />
  </form-field>
</template>

<script>

import FormField from "@/Components/Form/field";
import FormLabel from "@/Components/Form/label";
import FormError from "@/Components/Form/error";

export default {
    name: 'FormInput',
    components: {FormError, FormLabel, FormField},
    props: {
        name: {type: String, required: true},
        label: {type: String, default: ''},
    }
}
</script>
