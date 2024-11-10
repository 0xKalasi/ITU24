<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { readRecipe } from "../../utils/api.js";

const recipe_id = route.params.recipe_id;

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

</script>

<template>
	<div v-if="!recipe_vm.ready.value">
		Načítání receptu...
	</div>
	<div v-if="recipe_vm.ready.value">
		<p>{{ recipe_vm.name }}</p>

		<p>Porce: {{ recipe_vm.portion_count }}</p>
		<p>Očekávaný čas: {{ recipe_vm.time_to_cook }}</p>

		Ingredience:
		<ul>
			<li v-for="(ingredient, index) in recipe_vm.ingredients">
				{{ ingredient.name }} {{ ingredient.quantity }} {{ ingredient.unit }}
			</li>
		</ul>

		Kategorie:
		<ul>
			<li v-for="(category, index) in recipe_vm.categories">
				{{ category.name }}
			</li>
		</ul>

		Náčiní:
		<ul>
			<li v-for="(utencil, index) in recipe_vm.utencils">
				{{ utencil.name }}
			</li>
		</ul>

		Alergeny:
		<ul>
			<li v-for="(alergen, index) in recipe_vm.alergens">
				{{ alergen.id }}. {{ alergen.name }}
			</li>
		</ul>

		<Button @click="router.replace('/cookmode/' + recipe_id + '/1')">Vařit</Button>
	</div>
</template>
