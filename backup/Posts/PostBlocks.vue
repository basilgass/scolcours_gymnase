<template>
	<div
		v-for="block in thePost.blocks"
		:key="block.id"
		class="my-5"
	>
		<markdown-it :text="block.body" />

		<illustration-show
			v-for="illustration of block.illustrations"
			:key="illustration.id"
			:illustration="illustration"
		/>
	</div>
</template>

<script setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue";</script>
