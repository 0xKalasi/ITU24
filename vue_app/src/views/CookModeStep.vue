<script setup>
import { ref } from "vue";
import { readRecipe, getCookState, deleteCookState } from "../../utils/api.js";
import TimerView from '../components/timerView.vue';
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const user_id = currentUser.id;
const recipe_id = parseInt( route.params.recipe_id );
let step_number = parseInt( route.params.step_number );
let max_step_number = Infinity;

/* create or load cook state */
let cook_state = await getCookState( user_id, recipe_id, step_number );

let step_vm = {
	ready: ref( false ),
	number: ref( 0 ),
	text: ref( "" ),
	name: ref( "" ),
};

function render() {
	step_vm.ready.value = false;

	getCookState( user_id, recipe_id, step_number ).then(
		( value ) => { cook_state = value }
	);
	//console.log( cook_state );

	readRecipe( recipe_id ).then(
		( value ) => {
			//console.log( value );

			let step = value.Step[ step_number - 1 ];

			console.log( step );

			step_vm.number.value = step.number;
			step_vm.name.value = step.name;
			step_vm.text.value = step.text;

			max_step_number = value.Step.length;

			step_vm.ready.value = true;
		}
	)

}

render();

function prev_step() {
	router.replace( '/cookmode/' + recipe_id + '/' + ( step_number - 1 ) );
	step_number -= 1;
	render()
}

function next_step() {
	router.replace( '/cookmode/' + recipe_id + '/' + ( step_number + 1 ) );
	step_number += 1;
	render()
}

function recipe() {
	router.replace( '/cookmode/' + recipe_id );
}

function finish() {
	router.back();

	deleteCookState( cook_state.id )
}

</script>

<template>
	<div v-if="!step_vm.ready.value">
		Načítání receptu...
	</div>
	<div v-if="step_vm.ready.value">
		<h4>Krok {{step_vm.number}}: {{step_vm.name}}</h4>
		<p>{{step_vm.text}}</p>

		<TimerView :cook_state_id="cook_state.id"/>

		<Button v-if="step_number == 1" @click="recipe">Recept</Button>

		<Button v-if="step_number > 1" @click="prev_step">Předchozí krok</Button>
		<Button v-if="step_number < max_step_number" @click="next_step">Následující krok</Button>
		<Button v-if="step_number == max_step_number" @click="finish">Hotovo</Button>
	</div>
</template>
