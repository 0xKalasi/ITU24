<!-- Ondřej Šatinský, xsatin03 -->
<script setup>

import { ref } from 'vue';
import TimeInput from './TimeInput.vue';
import {
	getCookTimers, createCookTimer,
	deleteCookTimer, updateCookTimer
} from "../../utils/api_cookmode.js";

const model = defineModel( { default: { show: ref( false ) } } );
const emit = defineEmits( [ 'created' ] )

function create_timer() {

	createCookTimer(
		model.value.cook_state_id,
		{ name: model.value.name.value, length: model.value.time.value }
	).then( ( value ) => {

		model.value.show.value = false;
		emit( 'created' )
	} )
}

</script>

<template>
	<Teleport to="body">
		<div v-if="model.show.value" class="modal_background" @click="model.show.value = false" />
		<div v-if="model.show.value" class="modal">
			<div style="text-align: center;"><h2>Nový časovač</h2></div>
			<form style="position: relative">
				<label for="name">Název</label><br>
				<Textarea
					id="name"
					v-model="model.name.value"
					style="width: 100%"
				></Textarea><br>
				<label>Čas (HH:MM:SS)</label>
				<div style="margin-left: auto; width: 100%; display: flex; justify-content: center">
					<TimeInput v-model="model.time.value" />
				</div>
				<br>
				<div style="margin: 1em; display: flex;">
					<Button
						@click="model.show.value = false"
						style="float: left; width: 50%; height: 5em"
					>Zahodit</Button>
					<Button
						@click="create_timer()"
						style="float: left; width: 50%; height: 5em"
					>Spustit/Vytvořit</Button>
				</div>
			</form>
		</div>
	</Teleport>
</template>

<style scoped>
.modal {
	position: fixed;
	background-color: var(--p-primary-900);
	z-index: 999;
	left: 15%;
	width: 70%;
	max-width: 1280px;
	margin-left: 0%;
	padding: 1em;
	border-radius: var(--p-button-border-radius);
}

.modal_background {
	position: fixed;
	background-color: #000000cc;
	z-index: 998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	margin-left: 0%;
}
</style>
