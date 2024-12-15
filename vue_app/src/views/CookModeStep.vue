<!-- Ondřej Šatinský, xsatin03 -->
<script setup>
import { ref, useTemplateRef } from "vue";
import {
	readRecipe,
} from "../../utils/api.js";
import {
	getCookState, deleteCookState,
	cookStateAddStep, createCookState,
	cookStateChangeStep,
} from '../../utils/api_cookmode.js';
import TimerView from '../components/TimerView.vue';
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useUserStore } from '../stores/userStore';
import BasicPageHeader from "../components/basicPageHeader.vue";
import NewTimer  from '../components/NewTimer.vue';
import { likeRecipe } from '../../utils/likes_api.js';
const currentUser = useUserStore();

/* check if user is logged in */
let logged_in = ref( true );
const user_id = currentUser.id;
if ( user_id == 0 ) {
	logged_in.value = false;
}

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

let new_timer_model = {
	name: ref( "" ),
	time: ref( 0 ),
	show: ref( false ),
	cook_state_id: 0,
};

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

	new_timer_model.cook_state_id = cook_state.id;

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

if ( user_id != 0 ) {
	update();
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

let rating_model = {
	show: ref( false ),
};

function show_rating() {
	rating_model.show.value = true;
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

	show_step_options( step )

	console.log( "long press on step: ", step )
}

function show_step_options( step ) {
	step.open_menu.value = true
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

	new_timer_model.name.value = timer.description;
	new_timer_model.time.value = timer.time;
	new_timer_model.show.value = true;
}

function load_timers() {
	timer_view.value.load_timers()
}

function like() {
	likeRecipe( recipe_id, user_id );
}

</script>

<template>
	<div v-if="!logged_in">
		Přihlašte se
	</div>
	<template v-else>
		<LoadingScreen v-if="!steps_vm.ready.value"/>
		<div v-if="steps_vm.ready.value">
			<Teleport to="body">

				<div v-if="rating_model.show.value" class="modal_background" @click="finish()" />
				<div v-if="rating_model.show.value" class="modal">
					<div style="text-align: center;"><h2>Hodnotit recept</h2></div>
					<div>
						<Button
							@click="like(); finish()"
							style="float: left; width: 50%; height: 5em"
						>Like</Button>
						<Button
							@click="finish()"
							style="float: left; width: 50%; height: 5em"
						>Přeskočit</Button>
					</div>
				</div>
			</Teleport>

			<NewTimer
				v-model="new_timer_model"
				@created="load_timers()"
			/>

			<BasicPageHeader backArrow :text="recipe.name"></BasicPageHeader>
			<div class="content">
				<div v-for="step in steps_vm.steps" class="step_container">
					<div
						@mousedown="step_mouse_down( step )"
						@touchstart="step_mouse_down( step )"
						@mouseup="step_mouse_up( step )"
						@touchend="step_mouse_up( step )"
						v-bind:class="
							{
								step: step.state == 0,
								step_hidden: step.state == 1
							}"
						v-if="step.state == 0 || (show_archived_steps && step.state == 1)"
					>
						<div class="step_bar">
							<div class="step_title">{{step.name + ( step.state == 1 ? " (Dokončeno)" : "" )}}</div>
							<div
								@click="show_step_options( step )"
								class="step_options"
							>...</div>
						</div>
						<div class="step_body">
							<p>{{step.text}}</p>
							<div v-if="step.timers.length != 0" class="step_timers">
								<h5
									style="margin-bottom: 0px"
								>Časovače</h5>
								<!--- @click="step.show_timers.value = !step.show_timers.value"
								<Button
									v-if="!step.show_timers.value"
									@click="step.show_timers.value = true"
								>Ukázat časovače</Button>
								<Button
									v-if="step.show_timers.value"
									@click="step.show_timers.value = false"
								>Schovat časovače</Button>
								--->
								<div>
									<Button
										v-if="step.show_timers.value"
										v-for="timer in step.timers"
										@click="open_step_timer( timer )"
										class="timer_button"
									>
										{{ timer.description }} - {{ format_time( timer.time ) }}
									</Button>
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
								>Dočastne schovat</Button>
							</div>
						</div>
					</div>
				</div>
				<div v-if="next_step_available">
					<Button @click="next_step" class="next_step">Další krok</Button>
				</div>
			</div>


			<div class="bottom">
				<TimerView :cook_state_id="cook_state.id" ref="timer_view"/>

				<Button @click="goto_recipe">Recept</Button>

				<Button v-if="recipe_finished" @click="show_rating">Hotovo</Button>
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
</template>

<style scoped>

.content {
	margin-bottom: 0px;
}

.content > * {
	margin-bottom: 1em;
}

.timer_button {
	width: 100%;
}

.bottom {
	position: sticky;
	bottom: 70px;
	width: auto;
	display: block;
	padding: 0.1em;
}

.step, .step_hidden {
	background-color: var(--p-primary-950);
	border-radius: var(--p-button-border-radius);
}

.step_title {
	margin-top: 0.2em;
	margin-bottom: 0.2em;
	margin-left: 1em;
}

.step_bar {
	overflow: hidden;
	white-space: nowrap;
	display: flex;
	font-weight: bold;
}

.step_options {
	text-align: right;
	width: 100%;
	margin-right: 1em;
}

.step_body, .step_menu {
	border-radius: var(--p-button-border-radius);
	padding: var(--p-button-padding-y) var(--p-button-padding-x);
}

.step_body {
	background-color: var(--p-primary-900);

	position: relative;
}

.step_timers > div {
	background-color: var(--p-primary-850);
}

.step_menu {
	background-color: Gray;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.next_step {
	width: 100%;
	height: 4em;
	font-weight: bold;
}

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
