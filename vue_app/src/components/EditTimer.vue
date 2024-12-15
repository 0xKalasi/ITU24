<script setup>

import { defineProps } from 'vue';
import TimeInput from './TimeInput.vue';

const model = defineModel( { default: { show: false } } );
const emit = defineEmits( [ 'reload' ] )

import {
	getCookTimers, createCookTimer,
	deleteCookTimer, updateCookTimer
} from "../../utils/api_cookmode.js";

function change_timer_time( delta ) {
	updateCookTimer(
		open_timer_model.id,
		{ rem_length: open_timer_model.time.value + delta }
	)
	.then( ( value ) => { emit( "reload" ); } )
}

function start_timer() {
	updateCookTimer(
		model.value.id.value,
		{ state: 1, start: ((new Date()).toISOString()).toLocaleString('zh-TW') }
	)
	.then( ( value ) => { emit( "reload" ); } )
}

function stop_timer() {
	updateCookTimer(
		model.value.id.value,
		{ state: 0, rem_length: model.value.time.value }
	)
	.then( ( value ) => { emit( "reload" ); } )
}

function update_timer() {
	updateCookTimer(
		model.value.id.value,
		{ name: model.value.name.value }
	)
		.then( ( value ) => { emit( "reload" ) } )
}


function delete_timer() {
	deleteCookTimer( model.value.id.value )
		.then(
			( value ) => { emit( "reload" ); model.value.show.value = false }
		)
}

</script>

<template>
	<Teleport to="body">
		<!-- edit timer -->
		<div v-if="model.show.value" class="modal_background" @click="model.show.value = false" />
		<div v-if="model.show.value" class="modal">
			<div><h2>Upravit časovač</h2></div>
			<form>
				<label for="name">Název</label><br>
				<input id="name" v-model="model.name.value"></input><br>
				<TimeInput v-model="model.time.value" />
				<div id="state">{{ model.state.value == 0 ? "Zastaven" : "Spuštěn" }}</div>
				<Button @click="change_timer_time( +1  )">+1 s</Button>
				<Button @click="change_timer_time( -1  )">-1 s</Button>
				<Button @click="change_timer_time( +10 )">+10 s</Button>
				<Button @click="change_timer_time( -10 )">-10 s</Button>
				<Button @click="change_timer_time( +1  * 60 )">+1 min</Button>
				<Button @click="change_timer_time( -1  * 60 )">-1 min</Button>
				<Button @click="change_timer_time( +10 * 60 )">+10 min</Button>
				<Button @click="change_timer_time( -10 * 60 )">-10 min</Button>
				<br>
				<Button @click="model.show.value = false">Zavřit</Button>
				<Button v-if="model.state.value == 0" @click="start_timer">Spustit</Button>
				<Button v-if="model.state.value == 1" @click="stop_timer">Zastavit</Button>
				<Button @click="update_timer">Uložit</Button>
				<Button @click="delete_timer">Smazat</Button>
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
