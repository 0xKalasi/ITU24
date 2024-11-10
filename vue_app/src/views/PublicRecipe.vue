<script setup>
import { readPublicRecipe } from '../../utils/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const recipeId = router.currentRoute.value.params.recipe_id;

const recipe = await readPublicRecipe(recipeId);
console.log(recipe);
</script>

<template>
    <!-- TODO: recipe categories -->
    <!-- TODO: nejde pridavat do Utencils dalsie utencils k receptu  -->

    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
        <Button @click="router.back" icon="pi pi-angle-left" style="height: 40px;"/>
        <h2 style="flex-grow: 1; text-align: center;">{{ recipe.name }}</h2>
    </div>

    <p>porce: {{ recipe.portions }}, čas: {{ recipe.time_to_cook / 60 }} minut</p>

    <div>
        <h4 style="display: inline;">Alergeny: </h4>
        <span v-for="(alergen, index) in recipe.RecipeAlergens" :key="alergen.alergen.id">
            {{ alergen.alergen.name }} ({{ alergen.alergen.id }})<span v-if="index < recipe.RecipeAlergens.length - 1">, </span>
        </span>
    </div>

    <h4>Ingredience</h4>
    <ul>
        <li v-for="ingredient in recipe.Ingredients">
            {{ ingredient.name }} {{ ingredient.quantity }} {{ ingredient.unit }}
            <ul v-if="ingredient.notes"> 
                <li>{{ ingredient.notes }}</li>
            </ul>
        </li>
    </ul>

    <div>
        <h4 style="display: inline;">Nutné náčiní: </h4>
        <span v-for="(utencil, index) in recipe.Utencils">
            {{ utencil.name }}<span v-if="index < recipe.Utencils.length - 1">, </span>
        </span>
    </div>

    <h4>Kroky</h4>
        <div v-for="step in recipe.Step">
            <b>{{ step.number }}. {{ step.name }} </b>
            <div class="stepText">{{ step.text }}</div>
        </div>
</template>

<style scoped>
.stepText {
    margin-left: 20px;
    margin-bottom: 10px;
}

</style>