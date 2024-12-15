<!-- Ondřej Šatinský, xsatin03 -->
<script setup>

import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';

const props = defineProps( {
	cook_state_id: Number,
} );

import { ref, useTemplateRef, onMounted } from 'vue';

function createNewTimerModel() {
	return {
		name: "",
		time: 10 * 60,
	}
}

const cook_state_id = props.cook_state_id;

import {
	getCookTimers, createCookTimer,
	deleteCookTimer, updateCookTimer
} from "../../utils/api_cookmode.js";

import TimeInput from '../components/TimeInput.vue';
import NewTimer  from '../components/NewTimer.vue';
import EditTimer from '../components/EditTimer.vue';

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

let new_timer_model = {
	show: ref( false ),
	time: ref( 0 ),
	name: ref( "" ),
	cook_state_id
};
let edit_timer_model = {
	id: ref( 0 ),
	name: ref( "" ),
	show: ref( false ),
	time: ref( 0 ),
	state: ref( 0 ),
	cook_state_id
};


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
		if ( edit_timer_model.id.value == t.id ) {
			edit_timer_model.time.value  = t.time;
			edit_timer_model.state.value = t.state;
		}
	}
}

setInterval( update_timers, 500 )

load_timers()

function new_timer() {
	new_timer_model.name.value = "";
	new_timer_model.time.value = 0;
	new_timer_model.show.value = true;
}

function open_timer( timer ) {

	edit_timer_model.id.value = timer.id
	edit_timer_model.name.value = timer.name
	edit_timer_model.state.value = timer.state
	edit_timer_model.time.value = timer.time

	edit_timer_model.show.value = true
}

function new_step_timer( timer ) {

	new_timer_time_ref.value.set_time( timer.time )

	new_timer_model = {
		name: timer.description,
		length: timer.time
	}

	tm_new.value = true
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

defineExpose( { load_timers } )

</script>

<template>

	<NewTimer
		v-model="new_timer_model"
		@created="load_timers()"
	/>
	<EditTimer
		v-model="edit_timer_model"
		@reload="load_timers()"
	/>

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
