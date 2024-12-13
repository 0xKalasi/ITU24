<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { readRecipe } from "../../utils/api.js";
import { getCookState } from '../../utils/api_cookmode.js';

const recipe_id = route.params.recipe_id;

import { useUserStore } from '../stores/userStore';
import BasicPageHeader from "../components/basicPageHeader.vue";
const currentUser = useUserStore();

/* check if user is logged in */
let logged_in = ref( true );
const user_id = currentUser.id;
console.log( 'user id', user_id )
if ( user_id == 0 ) {
	logged_in.value = false;
}
console.log( "logged in", logged_in.value );

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

if ( user_id != 0 ) {
	readRecipe( recipe_id ).then(
		( value ) => {
			console.log( value );

			recipe_vm.name.value  = value.name;
			recipe_vm.ingredients = value.Ingredients;
			for ( let i in recipe_vm.ingredients ) {
				recipe_vm.ingredients[ i ].selected = ref( false );
			}
			recipe_vm.utencils    = value.Utencils;
			for ( let i in recipe_vm.utencils ) {
				recipe_vm.utencils[ i ].selected = ref( false );
			}
			recipe_vm.alergens    = value.RecipeAlergens.map( ( x ) => x.Alergens )
			recipe_vm.categories  = value.RecipeCategories.map( ( x ) => x.Categories )
			recipe_vm.portion_count.value = value.portions;
			recipe_vm.time_to_cook.value = value.time_to_cook;

			console.log( recipe_vm.categories )

			recipe_vm.ready.value = true
		}
	)
}

function open_cook_step() {
	router.replace('/cookmode/' + recipe_id + '/steps' )
}

</script>

<template>
	<div v-if="!logged_in">
		Přihlašte se
	</div>
	<template v-else>
  		<LoadingScreen v-if="!recipe_vm.ready.value"></LoadingScreen>
		<div v-if="recipe_vm.ready.value">
			<BasicPageHeader :text="recipe_vm.name.value"></BasicPageHeader>

			<h4>Porce:</h4> {{ recipe_vm.portion_count }}
			<h4>Očekávaný čas:</h4> {{ recipe_vm.time_to_cook.value / 60 }} minut

			<h4>Ingredience:</h4>
			<ul>
				<template v-for="(ingredient, index) in recipe_vm.ingredients">
					<li
						v-bind:class="
							{
								selected: ingredient.selected.value,
								not_selected: !ingredient.selected.value,
							}"
						@click="ingredient.selected.value = !ingredient.selected.value"
					>
						{{ ingredient.name }} {{ ingredient.quantity }} {{ ingredient.unit }}
						<div class="note" v-if="ingredient.notes">{{ ingredient.notes }}</div>
					</li>
				</template>
			</ul>

			<h4>Náčiní:</h4>
			<ul>
				<template v-for="(utencil, index) in recipe_vm.utencils">
					<li
						v-bind:class="
							{
								selected: utencil.selected.value,
								not_selected: !utencil.selected.value,
							}"
						@click="utencil.selected.value = !utencil.selected.value"
					>
						{{ utencil.name }}
					</li>
				</template>
			</ul>

			<Button @click="open_cook_step">Vařit</Button>
		</div>
	</template>
</template>

<style scoped>

.selected {
	color: White;
	font-weight: bold;
}

.not_selected {
	color: Gray;
}

</style>
