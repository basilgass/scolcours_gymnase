<script lang="ts" setup>
import DialogModal from "@/Components/Ui/DialogModal.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import SeoSnippetPreview from "@/Components/Seo/SeoSnippetPreview.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import type {SeoRow} from "@/Composables/seoAudit.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import axios from "axios"
import {computed, ref, watch} from "vue"

/**
 * Modale d'édition de l'override SEO d'une ligne d'audit.
 *
 * Pré-remplie sans requête depuis les champs `override_*` de la ligne. La
 * sauvegarde fait un unique `PATCH admin.seo.update` (upsert) ; « réinitialiser »
 * envoie deux champs vides → le serveur supprime l'override et renvoie la
 * description dérivée, ré-affichée dans l'aperçu.
 */
const props = defineProps<{
	row: SeoRow | null
}>()

const show = defineModel<boolean>({default: false})

const emits = defineEmits<{
	saved: [row: SeoRow]
}>()

const flash = useStoreFlashMessage()

const metaTitle = ref("")
const metaDescription = ref("")
const resolvedTitle = ref("")
const resolvedDescription = ref("")
const saving = ref(false)

watch(
	() => props.row,
	(row) => {
		if (!row) {
			return
		}
		metaTitle.value = row.override_title ?? ""
		metaDescription.value = row.override_description ?? ""
		resolvedTitle.value = row.title
		resolvedDescription.value = row.description
	},
	{immediate: true},
)

const previewTitle = computed<string>(() => metaTitle.value.trim() || resolvedTitle.value)
const previewDescription = computed<string>(() => metaDescription.value.trim() || resolvedDescription.value)

async function save(): Promise<void> {
	if (!props.row?.metable_id) {
		return
	}

	saving.value = true

	try {
		const {data} = await axios.patch(route("admin.seo.update"), {
			type:             props.row.type,
			id:               props.row.metable_id,
			meta_title:       metaTitle.value,
			meta_description: metaDescription.value,
		})

		resolvedTitle.value = data.title
		resolvedDescription.value = data.description

		emits("saved", {
			...props.row,
			title:                data.title,
			description:          data.description,
			source:               data.source,
			length:               data.length,
			override_title:       data.override_title,
			override_description: data.override_description,
		})

		flash.success("Métadonnées SEO enregistrées")
		show.value = false
	} catch (error) {
		flash.error("Erreur lors de l'enregistrement des métadonnées SEO")
		console.warn(error)
	} finally {
		saving.value = false
	}
}

function reset(): void {
	metaTitle.value = ""
	metaDescription.value = ""
	save()
}
</script>

<template>
	<DialogModal
		v-model="show"
		title="Éditer les métadonnées SEO"
		class="w-[40rem]"
	>
		<div
			v-if="row"
			class="p-4 flex flex-col gap-4"
		>
			<p class="text-xs text-gray-500 break-all">
				{{ row.url }}
			</p>

			<FormInput
				v-model="metaTitle"
				label="Titre (override)"
				:placeholder="resolvedTitle"
			/>

			<FormTextarea
				v-model="metaDescription"
				label="Description (override)"
				rows="3"
			/>

			<div>
				<p class="text-xs text-gray-400 mb-1">
					Aperçu
				</p>
				<SeoSnippetPreview
					:title="previewTitle"
					:url="row.url"
					:description="previewDescription"
				/>
			</div>
		</div>

		<template #footer>
			<div class="flex justify-end gap-3 p-3">
				<ScButton
					type="cancel"
					xs
					@click="reset"
				>
					réinitialiser
				</ScButton>
				<ScButton
					type="primary"
					xs
					:disabled="saving"
					@click="save"
				>
					enregistrer
				</ScButton>
			</div>
		</template>
	</DialogModal>
</template>
