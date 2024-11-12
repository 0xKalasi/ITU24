<script setup>

const props = defineProps( {
	cook_state_id: Number,
} );

import { ref } from 'vue'

function createNewTimerModel() {
	return {
		name: "",
		time: 10 * 60,
	}
}

let new_timer_model = createNewTimerModel();
let open_timer_model = {};

const cook_state_id = props.cook_state_id;

import { getCookTimers, createCookTimer, deleteCookTimer, updateCookTimer } from "../../utils/api.js";
import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

let timers = ref( [] );

function load_timers() {
	getCookTimers( cook_state_id ).then(
		( value ) => {
			console.log( value )
			timers.value = value;
			update_timers();
		}
	)
}

function update_timers() {

	const now = Date.now()

	for ( let i in timers.value ) {
		let t = timers.value[ i ];

		if ( t.state == 0 ) {
			t.time = t.rem_length
		}

		if ( t.state == 1 ) {

			const diff = Math.floor( ( now - Date.parse( t.start + "+00:00" ) ) / 1000 );

			t.time = t.rem_length - diff;

			/* timer finishes */
			if ( t.time <= 0 ) {
				t.time = 0;
				t.state = 2;

				// TODO: show popup
			}
		}

		/* update open timer model */
		if ( open_timer_model.id == t.id ) {
			open_timer_model.time.value = t.time;
			open_timer_model.state.value = t.state;
		}
	}
}

setInterval( update_timers, 500 )

load_timers()

const tm_new  = ref( false )
const tm_open = ref( false )

function new_timer() {
	tm_new.value = true
}

function open_timer( timer ) {
	tm_open.value = true

	open_timer_model = {
		id: timer.id,
		name: timer.name,
		state: ref( timer.state ),
		time: ref( timer.time )
	}
}

function create_timer( timer ) {

	createCookTimer( cook_state_id, { name: timer.name, length: parseInt( timer.time ) } )
		.then ( ( value ) => { load_timers() } )

	tm_new.value = false

	new_timer_model = createNewTimerModel();
}

function update_timer() {
	updateCookTimer( open_timer_model.id, { name: open_timer_model.name } )
	.then( ( value ) => { load_timers() } )
}

function delete_timer() {
	let timer = open_timer_model;

	deleteCookTimer( timer.id )
		.then( ( value ) => { load_timers(); tm_open.value = false } )
}

function format_time( time ) {
	let out = ""

	const hours = Math.floor( time / 60 / 60 );
	if ( hours > 0 )
		out += hours + ":";
	const minutes = Math.floor( time / 60 ) % 60;
	const seconds = Math.floor( time % 60 );
	out += String( minutes ).padStart( 2, '0' ) + ":" + String( seconds ).padStart( 2, '0' );

	return out;
}

function start_timer() {
	updateCookTimer(
		open_timer_model.id,
		{ state: 1, start: ((new Date()).toISOString()).toLocaleString('zh-TW') }
	)
	.then( ( value ) => { load_timers() } )
}

function stop_timer() {
	updateCookTimer(
		open_timer_model.id,
		{ state: 0, rem_length: open_timer_model.time.value }
	)
	.then( ( value ) => { load_timers() } )
}

function change_timer_time( delta ) {
	updateCookTimer(
		open_timer_model.id,
		{ rem_length: open_timer_model.time.value + delta }
	)
	.then( ( value ) => { load_timers() } )
}

</script>

<template>

	<Teleport to="body">
		<div v-if="tm_new" class="modal_background" @click="tm_new = false" />
		<div v-if="tm_new" class="modal">
			<div><h2>Nový časovač</h2></div>
			<form>
				<label for="name">Název</label><br>
				<input id="name" v-model="new_timer_model.name"></input><br>
				<label for="time">Čas</label><br>
				<input id="time" v-model="new_timer_model.time"></input>
				<br>
				<Button @click="tm_new = false">Zahodit</Button>
				<Button @click="create_timer( new_timer_model )">Vytvořit</Button>
			</form>
		</div>
		<div v-if="tm_open" class="modal_background" @click="tm_open = false" />
		<div v-if="tm_open" class="modal">
			<div><h2>Upravit časovač</h2></div>
			<form>
				<label for="name">Název</label><br>
				<input id="name" v-model="open_timer_model.name"></input><br>
				<div id="time">Čas: {{ format_time( open_timer_model.time.value ) }}</div>
				<div id="state">{{ open_timer_model.state.value == 0 ? "Zastaven" : "Spuštěn" }}</div>
				<Button @click="change_timer_time( +1  )">+1 s</Button>
				<Button @click="change_timer_time( -1  )">-1 s</Button>
				<Button @click="change_timer_time( +10 )">+10 s</Button>
				<Button @click="change_timer_time( -10 )">-10 s</Button>
				<Button @click="change_timer_time( +1  * 60 )">+1 min</Button>
				<Button @click="change_timer_time( -1  * 60 )">-1 min</Button>
				<Button @click="change_timer_time( +10 * 60 )">+10 min</Button>
				<Button @click="change_timer_time( -10 * 60 )">-10 min</Button>
				<br>
				<Button @click="tm_open = false">Zavřit</Button>
				<Button v-if="open_timer_model.state.value == 0" @click="start_timer">Spustit</Button>
				<Button v-if="open_timer_model.state.value == 1" @click="stop_timer">Zastavit</Button>
				<Button @click="update_timer">Uložit</Button>
				<Button @click="delete_timer">Smazat</Button>
			</form>
		</div>
	</Teleport>

	<div class="timer_view">
		<h4>Časovače</h4>
		<div>
			<Button v-for="(timer, index) in timers" @click="open_timer( timer )" >
				<div v-if="timer.name">
					<h3>{{ timer.name }}</h3>
				</div>
				<h4 v-if="timer.state == 2">Hotovo</h4>
				<p v-if="timer.state != 2">{{ format_time( timer.time ) }}</p>
			</Button>

			<Button @click="new_timer">+</Button>
		</div>
	</div>
</template>

<style scoped>
.modal {
	position: fixed;
	background-color: gray;
	z-index: 999;
	top: 20%;
	left: 15%;
	width: 70%;
	height: 60%;
	margin-left: 0%;
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

.timer_view {
	background-color: var(--p-primary-950);
	border-radius: var(--p-button-border-radius);
	overflow-y: scroll;
}

.timer_view > h4 {
	margin-top: 0.2em;
	margin-bottom: 0.2em;
	margin-left: 1em;
}

.timer_view > div {
	background-color: var(--p-primary-900);
	border-radius: var(--p-button-border-radius);
	padding: var(--p-button-padding-y) var(--p-button-padding-x);
	overflow-y: scroll;
}

.timer_view button h3 {
	margin-top: 0.2em;
	margin-bottom: 0em;
}

.timer_view button p {
	margin-top: 0.2em;
	margin-bottom: 0.2em;
}

.p-button {
	display: inline;
}
</style>
