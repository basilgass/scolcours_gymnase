<!--<info>
parameters: key=#,text|clear|code|expanded
code: la phrase à coder
</info>-->
<script setup lang="ts">
import {WidgetPropsInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import {useWidget} from "@/Components/Widgets/useWidget.ts"
import CryptoHeader from "@/Components/Widgets/arithmetique/Parts/crypto-header.vue"
import {Cipher} from "@/helpers/cipher.ts"

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const {parameters, cipherKey} = useWidget<number>(props, "number")
const alphabet = Cipher.alphabet.join('')

const clearText = computed(() => Cipher._normalize(props.illustration.code))
const cesarCoded = computed(() => Cipher.cesar(cipherKey.value, clearText.value))
const showTable = computed(() => !parameters.value['!table'])

const shift = computed(() => {
	return ((cipherKey.value % 26) + 26) % 26
})

const cipherAlphabet = alphabet + alphabet
const highlight = ref<number>(-1)
const cellSize = ref<number>(32) // 32–40 OK mobile


function onHover(value: { index: number, clear: string, cipher: string, key: string }) {
	if (value === null) return
	highlight.value = alphabet.indexOf(value.clear)
}
</script>

<template>
	<article class="space-y-6">
		<crypto-header
			v-model="cipherKey"
			key-label="chiffre de César"
			key-type="number"
			:text="{
				clear: clearText,
				cipher: cesarCoded
			}"
			:parameters
			@hover="onHover"
		/>

		<div v-if="showTable">
			<div
				v-theme.text
				class="flex gap-1 justify-start items-baseline"
			>
				<i
					class="bi text"
					:class="cellSize===32 ? 'bi-square-fill': 'bi-square'"
					@click="cellSize=32"
				/>
				<i
					class="bi text-sm"
					:class="cellSize===28 ? 'bi-square-fill': 'bi-square'"
					@click="cellSize=28"
				/>
				<i
					class="bi text-xs"
					:class="cellSize===24 ? 'bi-square-fill': 'bi-square'"
					@click="cellSize=24"
				/>
			</div>

			<div
				class="overflow-x-scroll text-center min-h-24 grid place-items-center transition-all"
				:style="{'--cell': cellSize + 'px'}"
			>
				<div class="relative grid font-code cursor-pointer">
					<div class="flex row text-sm">
						<div
							v-for="(alpha, index) in alphabet"
							:key="`index-${alpha}`"
							:class="[
								'transition-colors',
								'cell grid place-items-center',
								highlight===index ? 'bg-green-100' : ''
							]"
							@mouseenter="highlight=index"
							@mouseleave="highlight=-1"
						>
							{{ index }}
						</div>
					</div>
					<div class="flex row">
						<div
							v-for="(alpha, index) in alphabet"
							:key="`clear-${alpha}`"
							:class="[
								'transition-colors',
								'cell grid place-items-center',
								highlight===index ? 'bg-green-100' : ''
							]"
							@mouseenter="highlight=index"
							@mouseleave="highlight=-1"
						>
							{{ alpha }}
						</div>
					</div>
					<div class="row" />
					<div class="row absolute bottom-0 left-0 right-0 overflow-hidden">
						<div
							class="flex row row2
								cesar-row
								"
							:style="{
								'--shift': shift
							}"
						>
							<div
								v-for="(alpha, index) in cipherAlphabet"
								:key="`coded-${alpha}-${index}`"
								:class="[
									'transition-colors',
									'cell grid place-items-center',
									`letter-${alpha}`,
									(highlight===index-shift ) ? 'bg-red-300 font-semibold' : ''
								]"
								@mouseenter="highlight=index-shift"
								@mouseleave="highlight=-1"
							>
								{{ alpha }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>

<style scoped>
.grid {
	--cell-width: 1.6rem;
	--cell-height: 1.6rem;
}

.cell {
	min-width: var(--cell);
	min-height: var(--cell);
	text-align: center;
	border: thin solid black;
}

.row {
	width: calc(26 * var(--cell));
	max-width: calc(26 * var(--cell));
	min-height: var(--cell);
}

.row2 {
	width: calc(2 * 26 * var(--cell));
}

.cesar-row {
	--shift: 0;
	transform: translateX(calc(
		-1 * var(--shift) * var(--cell)
	));
	transition: transform 0.5s cubic-bezier(.4, 0, .2, 1);
	will-change: transform;
}
</style>
