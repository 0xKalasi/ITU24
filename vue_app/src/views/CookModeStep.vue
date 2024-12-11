<script setup>
import { ref } from "vue";
import {
	readRecipe,
} from "../../utils/api.js";
import {
	getCookState, deleteCookState,
	cookStateAddStep, createCookState,
	cookStateChangeStep,
} from '../../utils/api_cookmode.js';
import TimerView from '../components/timerView.vue';
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useUserStore } from '../stores/userStore';
import BasicPageHeader from "../components/basicPageHeader.vue";
const currentUser = useUserStore();

const user_id = currentUser.id;
const recipe_id = parseInt( route.params.recipe_id );

/* create or load cook state */
console.log( user_id, recipe_id );
let cook_state = null;
let recipe = null;

let recipe_finished = ref( false );
let next_step_available = ref( false );

/* step state:
	0 - visible
	1 - archived - finished
	2 - closed - not finished
*/

let show_archived_steps = ref( false );

let steps_vm = {
	ready: ref( false ),
	steps: [],
};

let timer_view = ref( null );
console.log( timer_view )

async function update_async() {
	// get recipe
	recipe = await readRecipe( recipe_id );
	console.log( 'recipe', recipe );

	// get cook state
	const cs = await getCookState( user_id, recipe_id );
	console.log( 'cs', cs );
	cook_state = cs;

	// state does not exist, create it
	if ( cs == null ) {
		const r = await createCookState( user_id, recipe_id );
		if ( r ) {
			// pull it again
			cook_state = await getCookState( user_id, recipe_id );
		}
	}

	// still not available
	if ( cook_state == null ) {
		console.log( "ERROR" );
		return;
	}

	// update steps
	steps_vm.steps = [];
	for ( let i in cook_state.CookStateStep ) {
		let step = cook_state.CookStateStep[ i ];

		let step_data = recipe.Step[ step.step_number - 1 ];

		steps_vm.steps.push( {
			name: step_data.name,
			state: step.state,
			number: step.step_number,
			text: step_data.text,
			open_menu: ref( false ),
			timers: step_data.Timer,
			show_timers: ref( true ),
		} );
	}

	console.log( 'steps_vm', steps_vm );

	// update next_step_available
	next_step_available.value = false;
	if ( recipe.Step.length > cook_state.CookStateStep.length ) {
		next_step_available.value = true;
	} else {
		for ( let i in cook_state.CookStateStep ) {
			let step = cook_state.CookStateStep[ i ];

			if ( step.state == 2 ) {
				next_step_available.value = true;
				break;
			}
		}
	}

	// update recipe_finished
	recipe_finished.value = true
	for ( let i in cook_state.CookStateStep ) {
		let step = cook_state.CookStateStep[ i ];

		if ( step.state != 1 ) {
			recipe_finished.value = false
			break;
		}
	}
	if ( cook_state.CookStateStep.length != recipe.Step.length ) {
		recipe_finished.value = false
	}

	steps_vm.ready.value = true;
}

function update() {
	steps_vm.ready.value = false;

	update_async();
}

update();

function next_step() {

	// check if a step in state 2 exists
	for ( let i in cook_state.CookStateStep ) {
		let step = cook_state.CookStateStep[ i ];

		if ( step.state == 2 ) {

			steps_vm.ready.value = false;
			cookStateChangeStep( cook_state.id, step.step_number, 0 ).then(
				( value ) => { update() }
			)

			return;
		}
	}

	// add next step to state
	let step_number = 1;
	for ( let i in cook_state.CookStateStep ) {
		let step = cook_state.CookStateStep[ i ];

		if ( step.step_number != step_number )
			break;

		++step_number;
	}

	steps_vm.ready.value = false;
	cookStateAddStep( cook_state.id, step_number ).then(
		( value ) => { update() }
	)

}

function goto_recipe() {
	router.replace( '/cookmode/' + recipe_id );
}

function finish() {
	router.back();

	deleteCookState( cook_state.id )
}

function step_mouse_down( step ) {
	step.mouse_down = Date.now()
}

function step_mouse_up( step ) {
	if ( !step.mouse_down )
		return

	let now = Date.now()
	let down = step.mouse_down

	step.mouse_down = null

	if ( now - down < 200 )
		return

	step.open_menu.value = true

	console.log( "long press on step: ", step )
}

function open_step( step ) {
	console.log( 'open step', step )

	cookStateChangeStep( cook_state.id, step.number, 0 )
	.then(
		( value ) => { update() }
	)
}

function finish_step( step ) {
	console.log( 'finish step', step )

	cookStateChangeStep( cook_state.id, step.number, 1 )
	.then(
		( value ) => { update() }
	)
}

function discard_step( step ) {
	console.log( 'discard step', step )

	cookStateChangeStep( cook_state.id, step.number, 2 )
	.then(
		( value ) => { update() }
	)
}

function open_step_timer( timer ) {
	console.log( 'open step timer', timer )

	timer_view.value.new_step_timer( timer )
}

</script>

<template>
	<div v-if="!steps_vm.ready.value">
		Načítání receptu...
	</div>
	<div v-if="steps_vm.ready.value">
		<BasicPageHeader :text="recipe.name"></BasicPageHeader>
		<div v-for="step in steps_vm.steps" class="step_container">
			<div
				@mousedown="step_mouse_down( step )"
				@mouseup="step_mouse_up( step )"
				v-bind:class="
					{
						step: step.state == 0,
						step_hidden: step.state == 1
					}"
				v-if="step.state == 0 || (show_archived_steps && step.state == 1)"
			>
				<h4>Krok {{step.number}}: {{step.name}}</h4>
				<p>{{step.text}}</p>
				<div v-if="step.timers.length != 0">
					<Button
						v-if="!step.show_timers.value"
						@click="step.show_timers.value = true"
					>Ukázat časovače</Button>
					<Button
						v-if="step.show_timers.value"
						@click="step.show_timers.value = false"
					>Schovat časovače</Button>
					<div
						v-if="step.show_timers.value"
						v-for="timer in step.timers"
						@click="open_step_timer( timer )"
					>
						{{ timer.description }} - {{ timer.time }}
					</div>
				</div>
			</div>
			<div class="step_menu" v-if="step.open_menu.value" @click="step.open_menu.value = false">
				<Button
					v-if="step.state != 0"
					@click="open_step( step )"
				>Otevřít krok</Button>
				<Button
					v-if="step.state != 1"
					@click="finish_step( step )"
				>Krok dokončen</Button>
				<Button
					v-if="step.state != 2"
					@click="discard_step( step )"
				>Zahodit krok</Button>
			</div>
		</div>

		<div v-if="next_step_available">
			<Button @click="next_step">Další krok</Button>
		</div>

		<div>
			<TimerView :cook_state_id="cook_state.id" ref="timer_view"/>

			<Button @click="goto_recipe">Recept</Button>

			<Button v-if="recipe_finished" @click="finish">Hotovo</Button>
			<Button
				v-if="show_archived_steps == false"
				@click="show_archived_steps = true"
			>
				Zobrazit ukončené kroky
			</Button>
			<Button
				v-if="show_archived_steps == true"
				@click="show_archived_steps = false"
			>
				Schovat ukončené kroky
			</Button>
		</div>
	</div>
</template>

<style scoped>
.step_container {
	height: auto;
/*	position: relative; */
}
/*
.step, .step_hidden, .step_menu {
	position: absolute;
	top: 0;
	bottom: 0;
	height: auto;
}
*/
.step {
	background-color: green;
}

.step_hidden {
	background-color: DarkGreen;
}

.step_menu {
	background-color: Gray;
}
</style>
