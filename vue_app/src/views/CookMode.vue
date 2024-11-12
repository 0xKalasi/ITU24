<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { readRecipe, getCookState } from "../../utils/api.js";

const recipe_id = route.params.recipe_id;

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const user_id = currentUser.id;

let recipe_vm = {
	ready: ref( false ),
	name: ref( "" ),
	ingredients: [],
	utencils: [],
	alergens: [],
	categories: [],
	portion_count: ref( 0 ),
	time_to_cook: ref( "" ),
}

readRecipe( recipe_id ).then(
	( value ) => {
		console.log( value );

		recipe_vm.name.value  = value.name;
		recipe_vm.ingredients = value.Ingredients;
		recipe_vm.utencils    = value.Utencils;
		recipe_vm.alergens    = value.RecipeAlergens.map( ( x ) => x.Alergens )
		recipe_vm.categories  = value.RecipeCategories.map( ( x ) => x.Categories )
		recipe_vm.portion_count.value = value.portions;
		recipe_vm.time_to_cook.value = value.time_to_cook;

		console.log( recipe_vm.categories )

		recipe_vm.ready.value = true
	}
)

function open_cook_step() {

	getCookState( user_id, recipe_id, null )
	.then(
		( value ) => {
			const step_number = value.step_number ? value.step_number : 1;
			router.replace('/cookmode/' + recipe_id + '/' + step_number )
		}
	)

}

</script>

<template>
	<div v-if="!recipe_vm.ready.value">
		Načítání receptu...
	</div>
	<div v-if="recipe_vm.ready.value">
		<h2>{{ recipe_vm.name }}</h2>

		<h4>Porce:</h4> {{ recipe_vm.portion_count }}
		<h4>Očekávaný čas:</h4> {{ recipe_vm.time_to_cook.value / 60 }} minut

		<h4>Ingredience:</h4>
		<ul>
			<li v-for="(ingredient, index) in recipe_vm.ingredients">
				<input type="checkbox"/>
				{{ ingredient.name }} {{ ingredient.quantity }} {{ ingredient.unit }}
				<div class="note" v-if="ingredient.notes">{{ ingredient.notes }}</div>
			</li>
		</ul>

		<h4>Náčiní:</h4>
		<ul>
			<li v-for="(utencil, index) in recipe_vm.utencils">
				<input type="checkbox"/>
				{{ utencil.name }}
			</li>
		</ul>

		<Button @click="open_cook_step">Vařit</Button>
	</div>
</template>
