<script setup>
import { ref } from "vue";

import { readRecipe } from "../../utils/api.js";

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const recipe_id = parseInt( route.params.recipe_id );
let step_number = parseInt( route.params.step_number );
let max_step_number = Infinity;

let step_vm = {
	ready: ref( false ),
	number: ref( 0 ),
	text: ref( "" ),
	name: ref( "" ),
};

function render() {
	step_vm.ready.value = false;

	readRecipe( recipe_id ).then(
		( value ) => {
			console.log( value );

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
}

</script>

<template>
	<div v-if="!step_vm.ready.value">
		Načítání receptu...
	</div>
	<div v-if="step_vm.ready.value">
		<p>Krok {{step_vm.number}}: {{step_vm.name}}</p>
		<p>{{step_vm.text}}</p>

		<Button v-if="step_number == 1" @click="recipe">Recept</Button>

		<Button v-if="step_number > 1" @click="prev_step">Předchozí krok</Button>
		<Button v-if="step_number < max_step_number" @click="next_step">Následující krok</Button>
		<Button v-if="step_number == max_step_number" @click="finish">Hotovo</Button>
	</div>
</template>
